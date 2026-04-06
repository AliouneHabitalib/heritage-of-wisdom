import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const PAYTECH_API_KEY = Deno.env.get("PAYTECH_API_KEY");
    const PAYTECH_API_SECRET = Deno.env.get("PAYTECH_API_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!PAYTECH_API_KEY || !PAYTECH_API_SECRET) {
      throw new Error("PayTech API keys not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ email, name, amount: 5000, currency: "XOF" })
      .select()
      .single();

    if (orderError) throw orderError;

    // Get the project URL for callbacks
    const siteUrl = req.headers.get("origin") || "https://heritage-of-wisdom.lovable.app";

    // Call PayTech API
    const paymentResponse = await fetch("https://paytech.sn/api/payment/request-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        API_KEY: PAYTECH_API_KEY,
        API_SECRET: PAYTECH_API_SECRET,
      },
      body: JSON.stringify({
        item_name: "La Sagesse d'une Mère - L'Héritage d'une Vie (PDF)",
        item_price: 5000,
        currency: "XOF",
        ref_command: order.id,
        command_name: `Livre - ${order.id}`,
        env: "prod",
        success_url: `${siteUrl}/paiement-succes?ref=${order.id}`,
        cancel_url: `${siteUrl}/#offre`,
        ipn_url: `${SUPABASE_URL}/functions/v1/payment-webhook`,
        custom_field: JSON.stringify({ order_id: order.id, email }),
      }),
    });

    const paymentData = await paymentResponse.json();

    if (!paymentResponse.ok) {
      throw new Error(`PayTech error: ${JSON.stringify(paymentData)}`);
    }

    // Update order with payment ref
    if (paymentData.token) {
      await supabase
        .from("orders")
        .update({ payment_ref: paymentData.token })
        .eq("id", order.id);
    }

    return new Response(JSON.stringify({
      success: true,
      redirect_url: paymentData.redirect_url,
      token: paymentData.token,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Payment error:", error);
    return new Response(JSON.stringify({
      error: error.message || "Erreur lors de la création du paiement",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

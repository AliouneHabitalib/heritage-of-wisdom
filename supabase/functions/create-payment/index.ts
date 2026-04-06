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

    if (orderError) {
      console.error("Order creation error:", orderError);
      throw orderError;
    }

    console.log("Order created:", order.id);

    const siteUrl = req.headers.get("origin") || "https://heritage-of-wisdom.lovable.app";

    // PayTech expects form-urlencoded body with API keys in headers
    const formData = new URLSearchParams();
    formData.append("item_name", "La Sagesse d'une Mère - L'Héritage d'une Vie (PDF)");
    formData.append("item_price", "5000");
    formData.append("currency", "XOF");
    formData.append("ref_command", order.id);
    formData.append("command_name", `Livre - ${order.id}`);
    formData.append("env", "prod");
    formData.append("success_url", `${siteUrl}/paiement-succes?ref=${order.id}`);
    formData.append("cancel_url", `${siteUrl}/#offre`);
    formData.append("ipn_url", `${SUPABASE_URL}/functions/v1/payment-webhook`);
    formData.append("custom_field", JSON.stringify({ order_id: order.id, email }));

    console.log("Calling PayTech API...");

    const paymentResponse = await fetch("https://paytech.sn/api/payment/request-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "API_KEY": PAYTECH_API_KEY,
        "API_SECRET": PAYTECH_API_SECRET,
      },
      body: formData.toString(),
    });

    const responseText = await paymentResponse.text();
    console.log("PayTech response status:", paymentResponse.status);
    console.log("PayTech response:", responseText);

    let paymentData;
    try {
      paymentData = JSON.parse(responseText);
    } catch {
      throw new Error(`PayTech returned non-JSON: ${responseText}`);
    }

    if (paymentData.success !== 1 && paymentData.success !== true) {
      throw new Error(`PayTech error: ${responseText}`);
    }

    // Update order with payment token
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

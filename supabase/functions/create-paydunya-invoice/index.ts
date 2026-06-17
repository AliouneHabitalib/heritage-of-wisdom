import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// PayDunya endpoints — live mode
const PAYDUNYA_BASE = "https://app.paydunya.com/api/v1";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { email, name } = await req.json();
    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email requis" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const masterKey = Deno.env.get("PAYDUNYA_MASTER_KEY");
    const publicKey = Deno.env.get("PAYDUNYA_PUBLIC_KEY");
    const privateKey = Deno.env.get("PAYDUNYA_PRIVATE_KEY");
    const token = Deno.env.get("PAYDUNYA_TOKEN");
    if (!masterKey || !publicKey || !privateKey || !token) {
      throw new Error("PayDunya non configuré");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const amount = 5000; // 5 000 FCFA
    const currency = "XOF";

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ email, name, amount, currency })
      .select()
      .single();
    if (orderError) throw orderError;

    const siteUrl = Deno.env.get("SITE_URL") || "https://heritage-of-wisdom.lovable.app";
    const projectId = Deno.env.get("SUPABASE_URL")!.split("//")[1].split(".")[0];
    const ipnUrl = `https://${projectId}.functions.supabase.co/paydunya-webhook`;

    const invoiceBody = {
      invoice: {
        total_amount: amount,
        description: "La Sagesse d'une Mère - L'Héritage d'une Vie (PDF)",
        items: {
          item_0: {
            name: "La Sagesse d'une Mère (PDF)",
            quantity: 1,
            unit_price: amount,
            total_price: amount,
            description: "Livre numérique au format PDF",
          },
        },
      },
      store: {
        name: "La Sagesse d'une Mère",
      },
      custom_data: {
        order_id: order.id,
      },
      actions: {
        cancel_url: `${siteUrl}/#offre`,
        return_url: `${siteUrl}/paiement-succes?ref=${order.id}&provider=paydunya`,
        callback_url: ipnUrl,
      },
    };

    const res = await fetch(`${PAYDUNYA_BASE}/checkout-invoice/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "PAYDUNYA-MASTER-KEY": masterKey,
        "PAYDUNYA-PUBLIC-KEY": publicKey,
        "PAYDUNYA-PRIVATE-KEY": privateKey,
        "PAYDUNYA-TOKEN": token,
      },
      body: JSON.stringify(invoiceBody),
    });

    const pd = await res.json();
    if (pd.response_code !== "00" || !pd.response_text) {
      console.error("PayDunya create error:", pd);
      return new Response(JSON.stringify({ error: pd.response_text || "Erreur PayDunya" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase.from("orders").update({ payment_ref: pd.token }).eq("id", order.id);

    return new Response(
      JSON.stringify({ redirect_url: pd.response_text, token: pd.token, order_id: order.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("create-paydunya-invoice error:", e);
    return new Response(JSON.stringify({ error: "Une erreur est survenue" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

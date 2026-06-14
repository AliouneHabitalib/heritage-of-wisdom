import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PAYPAL_BASE = "https://api-m.paypal.com"; // live

async function getAccessToken(clientId: string, secret: string): Promise<string> {
  const auth = btoa(`${clientId}:${secret}`);
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error("PayPal auth failed");
  const json = await res.json();
  return json.access_token;
}

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

    const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
    const secret = Deno.env.get("PAYPAL_CLIENT_SECRET");
    if (!clientId || !secret) throw new Error("PayPal not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const amount = "19.99";
    const currency = "EUR";

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ email, name, amount: 1999, currency })
      .select()
      .single();
    if (orderError) throw orderError;

    const siteUrl = Deno.env.get("SITE_URL") || "https://heritage-of-wisdom.lovable.app";
    const accessToken = await getAccessToken(clientId, secret);

    const createRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          reference_id: order.id,
          description: "La Sagesse d'une Mère - L'Héritage d'une Vie (PDF)",
          amount: { currency_code: currency, value: amount },
        }],
        application_context: {
          brand_name: "La Sagesse d'une Mère",
          user_action: "PAY_NOW",
          return_url: `${siteUrl}/paiement-succes?ref=${order.id}&provider=paypal`,
          cancel_url: `${siteUrl}/#offre`,
        },
      }),
    });

    const pp = await createRes.json();
    if (!createRes.ok || !pp.id) {
      console.error("PayPal create error:", pp);
      return new Response(JSON.stringify({ error: "Erreur PayPal" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase.from("orders").update({ payment_ref: pp.id }).eq("id", order.id);

    const approve = pp.links?.find((l: any) => l.rel === "approve")?.href;
    return new Response(JSON.stringify({ redirect_url: approve, paypal_order_id: pp.id, order_id: order.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-paypal-order error:", e);
    return new Response(JSON.stringify({ error: "Une erreur est survenue" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

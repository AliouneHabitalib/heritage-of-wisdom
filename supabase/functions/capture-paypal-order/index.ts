import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PAYPAL_BASE = "https://api-m.paypal.com";

async function getAccessToken(clientId: string, secret: string): Promise<string> {
  const auth = btoa(`${clientId}:${secret}`);
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error("PayPal auth failed");
  return (await res.json()).access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { order_id, paypal_order_id } = await req.json();
    if (!order_id || !paypal_order_id) {
      return new Response(JSON.stringify({ error: "Paramètres requis" }), {
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

    // Verify the paypal_order_id belongs to this order
    const { data: existing } = await supabase
      .from("orders")
      .select("payment_ref, payment_status")
      .eq("id", order_id)
      .maybeSingle();

    if (!existing || existing.payment_ref !== paypal_order_id) {
      return new Response(JSON.stringify({ error: "Commande invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (existing.payment_status === "completed") {
      return new Response(JSON.stringify({ status: "completed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessToken = await getAccessToken(clientId, secret);
    const capRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypal_order_id}/capture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    });
    const cap = await capRes.json();

    const completed = cap?.status === "COMPLETED";
    await supabase
      .from("orders")
      .update({
        payment_status: completed ? "completed" : "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order_id);

    return new Response(JSON.stringify({ status: completed ? "completed" : "failed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("capture-paypal-order error:", e);
    return new Response(JSON.stringify({ error: "Une erreur interne est survenue" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

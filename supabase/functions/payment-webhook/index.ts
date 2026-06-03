import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const PAYTECH_API_KEY = Deno.env.get("PAYTECH_API_KEY");
    const PAYTECH_API_SECRET = Deno.env.get("PAYTECH_API_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!PAYTECH_API_KEY || !PAYTECH_API_SECRET) {
      console.error("PayTech secrets missing");
      return new Response(JSON.stringify({ error: "Configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify PayTech IPN signature: SHA-256 of API_KEY and API_SECRET
    const expectedKeyHash = await sha256(PAYTECH_API_KEY);
    const expectedSecretHash = await sha256(PAYTECH_API_SECRET);

    const receivedKeyHash = body.api_key_sha256 || body.api_key_hash;
    const receivedSecretHash = body.api_secret_sha256 || body.api_secret_hash;

    if (
      typeof receivedKeyHash !== "string" ||
      typeof receivedSecretHash !== "string" ||
      receivedKeyHash !== expectedKeyHash ||
      receivedSecretHash !== expectedSecretHash
    ) {
      console.warn("Webhook signature verification failed");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const customField = typeof body.custom_field === "string"
      ? (() => { try { return JSON.parse(body.custom_field); } catch { return null; } })()
      : body.custom_field;

    const orderId = customField?.order_id || body.ref_command;

    if (!orderId || typeof orderId !== "string") {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const status = body.type_event === "sale_complete" ? "completed" : "failed";

    const { error } = await supabase
      .from("orders")
      .update({ payment_status: status, updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (error) {
      console.error("DB update error:", error);
      return new Response(JSON.stringify({ error: "Internal error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

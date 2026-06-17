import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// PayDunya IPN handler. PayDunya POSTs form-urlencoded data with a "data" JSON field.
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const privateKey = Deno.env.get("PAYDUNYA_PRIVATE_KEY");
    if (!privateKey) throw new Error("PayDunya non configuré");

    let payload: any = null;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      payload = await req.json();
    } else {
      const form = await req.formData();
      const dataField = form.get("data");
      if (typeof dataField === "string") {
        payload = JSON.parse(dataField);
      }
    }

    if (!payload) {
      return new Response("no payload", { status: 400, headers: corsHeaders });
    }

    // Verify hash = sha512(private_key)
    const encoder = new TextEncoder();
    const hashBuf = await crypto.subtle.digest("SHA-512", encoder.encode(privateKey));
    const expectedHash = Array.from(new Uint8Array(hashBuf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (payload.hash && payload.hash !== expectedHash) {
      console.error("PayDunya webhook: invalid hash");
      return new Response("invalid hash", { status: 401, headers: corsHeaders });
    }

    const status = payload.status; // "completed", "cancelled", etc.
    const orderId = payload.custom_data?.order_id;
    const invoiceToken = payload.invoice?.token;

    if (!orderId && !invoiceToken) {
      return new Response("no reference", { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const newStatus = status === "completed" ? "completed" : status === "cancelled" ? "failed" : "pending";

    const query = supabase.from("orders").update({ payment_status: newStatus });
    const { error } = orderId
      ? await query.eq("id", orderId)
      : await query.eq("payment_ref", invoiceToken);

    if (error) {
      console.error("paydunya-webhook update error:", error);
      return new Response("db error", { status: 500, headers: corsHeaders });
    }

    return new Response("ok", { status: 200, headers: corsHeaders });
  } catch (e) {
    console.error("paydunya-webhook error:", e);
    return new Response("error", { status: 500, headers: corsHeaders });
  }
});

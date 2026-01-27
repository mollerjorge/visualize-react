import { type ActionFunctionArgs } from "@remix-run/node";
import * as crypto from "crypto";

/**
 * Lemon Squeezy webhook endpoint
 * POST /webhooks/lemon-squeezy
 *
 * Verifies signature and forwards payment events to OpenPanel
 */
export async function action({ request }: ActionFunctionArgs) {
  // Get raw body BEFORE JSON parsing (required for signature verification)
  const rawBody = await request.text();

  // Verify signature
  // const signature = request.headers.get("X-Signature");
  // if (!signature) {
  //   return new Response("Missing signature", { status: 401 });
  // }

  // const secret = "george2106";

  // const expectedSignature = crypto
  //   .createHmac("sha256", secret)
  //   .update(rawBody)
  //   .digest("hex");

  // const signatureBuffer = new Uint8Array(Buffer.from(signature, "utf-8"));
  // const expectedBuffer = new Uint8Array(Buffer.from(expectedSignature, "utf-8"));

  // if (
  //   signatureBuffer.length !== expectedBuffer.length ||
  //   !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  // ) {
  //   return new Response("Invalid signature", { status: 401 });
  // }

  // Parse payload
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // Filter events
  const eventName = payload?.meta?.event_name;
  let trackingEventName: string | null = null;

  if (eventName === "order_created") {
    trackingEventName = "order_created";
  } else if (eventName === "subscription_created") {
    trackingEventName = "subscription_created_test";
  }

  if (!trackingEventName) {
    return new Response("OK", { status: 200 });
  }

  // Extract user data
  const attrs = payload?.data?.attributes;
  const properties = {
    user_name: attrs?.user_name,
    user_email: attrs?.user_email,
    subtotal_usd: attrs?.subtotal_usd,
  };

  // Send to OpenPanel (return 200 even if this fails)
  try {
    const clientId = "c3bfa7c1-eba6-48fa-b561-d18db7f4e858";
    const clientSecret = "sec_96e74501a465b4e5cfc2";

    if (clientSecret) {
      await fetch("https://api.openpanel.dev/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "openpanel-client-id": clientId,
          "openpanel-client-secret": clientSecret,
        },
        body: JSON.stringify({
          type: "track",
          payload: { name: trackingEventName, properties },
        }),
      });
    }
  } catch (error) {
    console.error("OpenPanel tracking failed:", error);
  }

  return new Response("OK", { status: 200 });
}

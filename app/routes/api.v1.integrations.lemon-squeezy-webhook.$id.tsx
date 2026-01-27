import { type ActionFunctionArgs } from "@remix-run/node";
import * as crypto from "crypto";

/**
 * Lemon Squeezy webhook endpoint with HMAC signature verification
 * Forwards payment events to OpenPanel for conversion tracking
 */
export async function action({ request }: ActionFunctionArgs) {
  // Reject non-POST requests
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Get raw body BEFORE any JSON parsing (required for signature verification)
  const rawBody = await request.text();

  // Extract signature from header
  const signature = request.headers.get("X-Signature");
  if (!signature) {
    return new Response("Missing signature", { status: 401 });
  }

  // Verify HMAC-SHA256 signature
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("LEMON_SQUEEZY_WEBHOOK_SECRET not configured");
    return new Response("Server configuration error", { status: 500 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  // Use timing-safe comparison to prevent timing attacks
  const signatureBuffer = Buffer.from(signature, "utf-8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf-8");

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return new Response("Invalid signature", { status: 401 });
  }

  // Parse webhook payload after signature verification
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch (error) {
    console.error("Invalid JSON payload:", error);
    return new Response("Invalid JSON", { status: 400 });
  }

  // Extract event type
  const eventName = payload?.meta?.event_name;
  if (!eventName) {
    return new Response("Missing event name", { status: 400 });
  }

  // Filter events we care about
  let trackingEventName: string | null = null;
  if (eventName === "order_created") {
    trackingEventName = "order_created";
  } else if (eventName === "subscription_created") {
    trackingEventName = "subscription_created_test";
  }

  // Ignore other events (return 200 to prevent retries)
  if (!trackingEventName) {
    return new Response("OK", { status: 200 });
  }

  // Extract user data from payload
  const attributes = payload?.data?.attributes;
  const userData = {
    user_name: attributes?.user_name,
    user_email: attributes?.user_email,
    subtotal_usd: attributes?.subtotal_usd,
  };

  // Forward to OpenPanel (fire-and-forget pattern)
  // Return 200 even if OpenPanel fails to prevent Lemon Squeezy retry storms
  try {
    const openpanelClientId = process.env.OPENPANEL_CLIENT_ID;
    const openpanelClientSecret = process.env.OPENPANEL_CLIENT_SECRET;

    if (!openpanelClientId || !openpanelClientSecret) {
      console.error("OpenPanel credentials not configured");
      return new Response("OK", { status: 200 });
    }

    await fetch("https://api.openpanel.dev/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "openpanel-client-id": openpanelClientId,
        "openpanel-client-secret": openpanelClientSecret,
      },
      body: JSON.stringify({
        type: "track",
        payload: {
          name: trackingEventName,
          properties: userData,
        },
      }),
    });
  } catch (error) {
    console.error("OpenPanel tracking failed:", error);
    // Still return 200 to prevent retries
  }

  return new Response("OK", { status: 200 });
}

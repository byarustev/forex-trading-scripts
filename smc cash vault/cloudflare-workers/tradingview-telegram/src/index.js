/**
 * TradingView alert webhook → Telegram sendMessage
 *
 * Expects POST with body = your TradingView "Message" (e.g. {{message}} from Pine).
 * Optional auth: header X-Webhook-Secret or query ?secret=...
 */
export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response("TradingView → Telegram relay. POST webhooks here.", {
        headers: { "content-type": "text/plain" },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const url = new URL(request.url);
    const headerSecret = request.headers.get("X-Webhook-Secret");
    const querySecret = url.searchParams.get("secret");
    const provided = headerSecret || querySecret || "";
    if (env.WEBHOOK_SECRET && provided !== env.WEBHOOK_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    const token = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      return new Response("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID", {
        status: 500,
      });
    }

    let raw = await request.text();
    if (!raw || raw.trim().length === 0) {
      raw = "(empty body)";
    }

    // If body is JSON (e.g. Pine jsonPayload), pretty-print for Telegram readability
    let text = raw;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        text = JSON.stringify(parsed, null, 2);
      }
    } catch {
      // keep raw string (plain text alert)
    }

    // Telegram hard limit 4096 chars per message
    const max = 4000;
    if (text.length > max) {
      text = text.slice(0, max) + "\n…(truncated)";
    }

    const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const tgRes = await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });

    const tgBody = await tgRes.text();
    if (!tgRes.ok) {
      return new Response(`Telegram error ${tgRes.status}: ${tgBody}`, {
        status: 502,
      });
    }

    return new Response("ok", { status: 200 });
  },
};

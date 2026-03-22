# TradingView → Telegram (Cloudflare Worker)

Relays webhook POSTs from TradingView to [Telegram `sendMessage`](https://core.telegram.org/bots/api#sendmessage). Your **bot token never appears in TradingView**; only the Worker URL and an optional shared secret do.

---

## 1. Prerequisites

- [Cloudflare](https://dash.cloudflare.com/) account (free tier is enough for low traffic).
- [Telegram bot token](https://core.telegram.org/bots#6-botfather) (from @BotFather).
- Your Telegram **chat_id** (private chat or group) — see [getUpdates](https://core.telegram.org/bots/api#getupdates) or any “get my id” bot).

---

## 2. Install Wrangler (CLI)

```bash
npm install -g wrangler
```

Login:

```bash
wrangler login
```

---

## 3. Deploy this Worker

From this folder (`cloudflare-workers/tradingview-telegram`):

```bash
cd cloudflare-workers/tradingview-telegram
wrangler deploy
```

Note the URL printed (e.g. `https://tradingview-telegram.<your-subdomain>.workers.dev`).

---

## 4. Set secrets (required)

Run these **from the same directory** (they apply to this Worker):

```bash
wrangler secret put TELEGRAM_BOT_TOKEN
# paste token from BotFather when prompted

wrangler secret put TELEGRAM_CHAT_ID
# paste numeric chat id, e.g. 123456789

wrangler secret put WEBHOOK_SECRET
# choose a long random string (e.g. openssl rand -hex 32)
```

- `WEBHOOK_SECRET` is optional but **strongly recommended** so random people cannot POST to your Worker URL and spam your Telegram.

After changing secrets, you do **not** need to redeploy unless you change code.

---

## 5. TradingView alert configuration

1. Create / edit an alert on your chart.
2. Enable **Webhook URL**.
3. **URL** (use your secret; never commit this URL):

   `https://YOUR-WORKER.workers.dev/?secret=PASTE_WEBHOOK_SECRET_HERE`

   Or omit the query and send the header instead (TradingView may not expose custom headers in all cases — the query is usually easiest):

   - If your product supports custom headers: `X-Webhook-Secret: <same value as WEBHOOK_SECRET>`.

4. **Message** field:

   - If your Pine script uses `alert(jsonPayload, alert.freq_once_per_bar_close)` with a JSON string, put:

     `{{message}}`

   so the **entire body** of the POST is your JSON payload. The Worker will pretty-print JSON for Telegram.

   - For a simple test, use plain text:

     `Hello from TradingView`

---

## 6. Test locally (optional)

```bash
wrangler dev
```

Then:

```bash
curl -X POST "http://localhost:8787/?secret=YOUR_WEBHOOK_SECRET" \
  -H "Content-Type: text/plain" \
  -d '{"test":true}'
```

You should see the message in Telegram.

---

## 7. Limits and notes

- Telegram messages are capped at **4096** characters; the Worker truncates long payloads (with a notice).
- **Rate limits:** Cloudflare Workers free tier has daily request limits; a few alerts per day is fine. Scale up or pay if you send very high volume.
- **HTTPS:** TradingView requires a public HTTPS webhook URL — `*.workers.dev` satisfies that.

---

## 8. Troubleshooting

| Issue | What to check |
|--------|----------------|
| 401 Unauthorized | `secret` query param or `X-Webhook-Secret` must match `WEBHOOK_SECRET` exactly. |
| 500 Missing token | Re-run `wrangler secret put` for `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. |
| 502 Telegram error | Invalid token, bot blocked, or wrong `chat_id`. Start the bot with `/start` in private chat. |
| Nothing in Telegram | Confirm alert actually fired; check **Webhook** notification in alert; test with `curl` above. |

---

## Disclaimer

This is infrastructure glue, not trading advice. Protect your bot token and webhook secret.

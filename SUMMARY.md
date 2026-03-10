# In Your Corner — Project Summary

A private support app that sends one supportive SMS per day to recipients using Twilio. This document summarizes the project, structure, setup, and usage.

---

## What It Does

- **Admin** manages recipients (name, E.164 phone, timezone, daily send time, active/paused) and message templates (body, category, active/personal).
- **AI daily message (optional)** When `OPENAI_API_KEY` and `USE_AI_DAILY_MESSAGE=true` are set, the app can generate one supportive message + 2–3 short resources per day via OpenAI. Today’s AI message is used for all sends when present; otherwise templates are used with a 14-day cooldown.
- **Daily cron** runs every 15 minutes; recipients in their send window get one message per calendar day. Message selection prefers today’s AI-generated content, then falls back to templates.
- **Twilio inbound** webhook logs all incoming SMS; keywords **STOP** / **PAUSE** pause the recipient, **START** / **RESUME** unpause, **HELP** returns a short reply.
- **Dashboard** shows active/paused counts, messages sent today, failed sends, and recent outbound/inbound logs.
- **Send test** and **Send now** buttons let you trigger a test message or an immediate support message for a recipient.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL + Prisma |
| SMS | Twilio Node SDK |
| Validation | Zod |
| Time / dates | date-fns, date-fns-tz |
| Deployment | Vercel + Vercel Cron |

---

## Project Structure

```
in-your-corner/
├── app/
│   ├── api/
│   │   ├── cron/send-daily-support/route.ts   # GET — daily send (cron-only)
│   │   ├── recipients/route.ts                  # GET, POST
│   │   ├── recipients/[id]/route.ts           # GET, PATCH, DELETE
│   │   ├── messages/route.ts                   # GET, POST
│   │   ├── messages/[id]/route.ts              # PATCH, DELETE
│   │   ├── logs/route.ts                       # GET ?type=outbound|inbound
│   │   ├── send-now/route.ts                   # POST { recipientId, test? }
│   │   └── twilio/inbound/route.ts             # POST — Twilio webhook
│   ├── recipients/page.tsx, client.tsx
│   ├── messages/page.tsx, client.tsx
│   ├── logs/page.tsx
│   ├── settings/page.tsx
│   ├── page.tsx                                # Dashboard
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── dashboard/   (stat-card, recent-log-table)
│   ├── recipients/  (recipient-form, recipient-table)
│   ├── messages/    (message-form, message-table)
│   ├── ui/          (button, card, input, textarea, badge)
│   └── nav.tsx
├── lib/
│   ├── prisma.ts, twilio.ts, validations.ts
│   ├── message-selector.ts, timezone.ts, sms.ts
│   ├── constants.ts, utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts       # 30 supportive message templates
├── types/index.ts
├── public/
├── .env.example
├── next.config.mjs
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── vercel.json       # Cron: */15 * * * *
├── README.md
└── SUMMARY.md        # This file
```

---

## Data Model (Prisma)

| Model | Purpose |
|-------|---------|
| **Recipient** | name, phone (E.164), timezone, sendHour, sendMinute, isActive, isPaused, notes |
| **MessageTemplate** | body, category, isActive, isPersonal |
| **MessageLog** | recipientId, templateId?, bodySent, status, twilioSid?, errorMessage?, sentAt |
| **InboundMessage** | recipientId?, fromPhone, body, normalizedBody, optAction?, twilioSid?, receivedAt |
| **DailySendLock** | recipientId + sentDate — one row per recipient per calendar day to prevent duplicate sends |

**Message categories:** encouragement, affirmation, reminder, gratitude, personal note, recovery support, check-in.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `TWILIO_ACCOUNT_SID` | Yes | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Yes | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Yes | Twilio number in E.164 (e.g. +15551234567) |
| `TWILIO_WEBHOOK_AUTH_TOKEN` | No | Optional for webhook signature verification (TODO) |
| `CRON_SECRET` | Yes for cron | Secret for protecting GET /api/cron/send-daily-support |
| `OPENAI_API_KEY` | No (for AI) | OpenAI API key for daily message + resources generation |
| `USE_AI_DAILY_MESSAGE` | No | Set to `true` to use AI-generated daily message when available |
| `NEXT_PUBLIC_APP_NAME` | No | App name (default: "In Your Corner") |

See `.env.example` for a template.

---

## Local Setup

```bash
cd in-your-corner
cp .env.example .env
# Edit .env with your DATABASE_URL, Twilio vars, and CRON_SECRET

npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Then open **http://localhost:3000**.

---

## Deployment (Vercel)

1. **Create project** — Push repo to GitHub and import in Vercel (or use `vercel` CLI).
2. **PostgreSQL** — Create a database (e.g. Vercel Postgres, Neon, Supabase). Add `DATABASE_URL` in Vercel → Settings → Environment Variables.
3. **Twilio** — Add `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`.
4. **Cron** — Set `CRON_SECRET` to a long random string. `vercel.json` schedules `/api/cron/send-daily-support` every 15 minutes.
5. **Twilio webhook** — In Twilio Console → Phone Numbers → your number → Messaging, set “A message comes in” to `https://<your-domain>/api/twilio/inbound`, method POST.
6. **DB** — After first deploy, run (using production `DATABASE_URL` if needed):
   ```bash
   npm run db:push
   npm run db:seed
   ```

---

## Manual Setup Checklist

| Where | Action |
|-------|--------|
| **PostgreSQL** | Create DB, copy connection string into `DATABASE_URL`. Run `db:push` and `db:seed`. |
| **Twilio** | Create account, get SID/token, buy a number. Set inbound webhook URL to `https://<your-app>/api/twilio/inbound`. |
| **Vercel** | Add all env vars. Ensure Cron is enabled; cron route must validate `CRON_SECRET` (e.g. `Authorization: Bearer <CRON_SECRET>`). |

---

## Key Behaviors

- **Cron:** Only recipients who are active, not paused, and within their send window (timezone + sendHour/sendMinute) get a message. One send per recipient per calendar day (enforced by `DailySendLock`).
- **Message selection:** Active templates only; avoids templates used for that recipient in the last 14 days; if all used recently, picks least recently used. Body trimmed to SMS-friendly length (e.g. 320 chars).
- **Inbound:** Incoming SMS is stored; body is normalized (uppercase, trimmed). STOP/PAUSE set `isPaused = true`; START/RESUME set `isPaused = false`. HELP returns a brief TwiML reply. Paused recipients are skipped by the cron.

---

## Pages & Routes

| Path | Description |
|------|-------------|
| `/` | Dashboard: stats (active/paused, sent today, failed today), recent outbound/inbound tables |
| `/recipients` | List recipients; add/edit; pause/resume; send test; send now; delete |
| `/messages` | List message templates; add/edit/delete |
| `/logs` | Outbound and inbound logs (last 100 each) |
| `/settings` | App name, env status (Twilio/Cron), endpoint notes, auth note |

---

## Future Enhancements

- **Admin auth** — Middleware or NextAuth to protect all admin routes.
- **Twilio signature verification** — Validate `X-Twilio-Signature` in `POST /api/twilio/inbound`.
- **More timezones** — Expand dropdown or add a timezone picker.
- **Message tags** — Optional tags on templates; filter in message selector.
- **Rate limiting** — Limit “Send now” and test sends per recipient.
- **Audit log** — Log admin create/update/delete on recipients and templates.

---

## Important Notes

- This is **not** a crisis, medical, or therapy app. It is a private support and encouragement system.
- Opt-out/pause is respected; no manipulative or guilt-based language in the product design.
- Admin auth is not implemented in the MVP; structure the code so auth can be added later (e.g. middleware or route protection).

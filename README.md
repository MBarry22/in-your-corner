# In Your Corner

A private support app that sends one supportive SMS per day to recipients using Twilio.

## Features

- **Recipients**: Add recipients with name, E.164 phone, timezone, and daily send time. Pause/resume per recipient.
- **Message templates**: Create categorized templates (encouragement, affirmation, check-in, etc.). Cooldown prevents reusing the same template within 14 days per recipient.
- **Daily cron**: Vercel Cron hits `/api/cron/send-daily-support` every 15 minutes; only recipients in their send window receive one message per calendar day.
- **Twilio inbound**: Reply STOP/PAUSE to pause, START/RESUME to resume. HELP returns a short reply. All inbound messages are logged.
- **Admin dashboard**: View stats, recent outbound/inbound logs, manage recipients and templates, send test or manual “send now” messages.

## Tech stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Prisma + PostgreSQL
- Twilio Node SDK, Zod, date-fns / date-fns-tz
- Vercel deployment + Vercel Cron

## Local setup

### Prerequisites

- Node.js 18+
- PostgreSQL (local or hosted)
- Twilio account and a phone number for SMS

### Commands

```bash
# Install dependencies
cd in-your-corner
npm install

# Copy env and fill in values
cp .env.example .env

# Generate Prisma client and push schema (no migrations)
npm run db:generate
npm run db:push

# Seed 30 supportive message templates
npm run db:seed

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables (.env)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `TWILIO_ACCOUNT_SID` | Yes | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Yes | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Yes | Twilio number in E.164 (e.g. +15551234567) |
| `TWILIO_WEBHOOK_AUTH_TOKEN` | No | Optional for webhook signature verification (TODO) |
| `CRON_SECRET` | Yes for cron | Secret for protecting the cron endpoint |
| `NEXT_PUBLIC_APP_NAME` | No | App name (default: "In Your Corner") |

## Deployment (Vercel)

1. **Create project**
   - Push the repo to GitHub and import the project in Vercel.
   - Or use Vercel CLI: `vercel`.

2. **PostgreSQL**
   - Create a Postgres database (e.g. Vercel Postgres, Neon, Supabase).
   - Add `DATABASE_URL` in Vercel → Project → Settings → Environment Variables.

3. **Twilio**
   - In Twilio: get Account SID, Auth Token, and buy/use a phone number.
   - In Vercel, set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`.

4. **Cron**
   - Set `CRON_SECRET` in Vercel to a long random string.
   - `vercel.json` is set to call `/api/cron/send-daily-support` every 15 minutes. Vercel will send the request with the `CRON_SECRET` in the `Authorization` header when configured (see [Vercel Cron](https://vercel.com/docs/cron-jobs)).

5. **Twilio webhook**
   - In Twilio Console → Phone Numbers → your number → Messaging: set “A message comes in” webhook to:
     - `https://your-domain.vercel.app/api/twilio/inbound`
   - Method: POST.

6. **DB migrate and seed**
   - After first deploy, run migrations and seed from your machine (or a one-off script) using the production `DATABASE_URL`:
   ```bash
   npm run db:push
   npm run db:seed
   ```
   Or use `prisma migrate deploy` if you use migrations.

## Manual setup summary

| Where | What to do |
|-------|------------|
| **Twilio** | Create account, get SID/token, buy a number, set inbound webhook URL to `https://<your-app>/api/twilio/inbound`. |
| **Vercel** | Add env vars (DB, Twilio, CRON_SECRET). Ensure Cron is enabled for the project. |
| **Postgres** | Create DB, set `DATABASE_URL`. Run `db:push` and `db:seed` after deploy. |

## Project structure

```
in-your-corner/
├── app/
│   ├── api/
│   │   ├── cron/send-daily-support/   # GET, cron-only
│   │   ├── recipients/               # GET, POST
│   │   ├── recipients/[id]/          # GET, PATCH, DELETE
│   │   ├── messages/                 # GET, POST
│   │   ├── messages/[id]/            # PATCH, DELETE
│   │   ├── logs/                     # GET ?type=outbound|inbound
│   │   ├── send-now/                 # POST { recipientId, test? }
│   │   └── twilio/inbound/           # POST (Twilio webhook)
│   ├── recipients/, messages/, logs/, settings/
│   ├── globals.css, layout.tsx, page.tsx
├── components/
│   ├── dashboard/ (stat-card, recent-log-table)
│   ├── recipients/ (recipient-form, recipient-table)
│   ├── messages/ (message-form, message-table)
│   ├── ui/ (button, card, input, textarea, badge)
│   └── nav.tsx
├── lib/
│   ├── prisma.ts, twilio.ts, validations.ts
│   ├── message-selector.ts, timezone.ts, sms.ts
│   ├── constants.ts, utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── types/index.ts
├── .env.example, vercel.json, README.md
└── package.json, tsconfig.json, next.config.ts, tailwind.config.ts
```

## Future enhancements

- **Admin auth**: Middleware or auth provider (e.g. NextAuth) to protect all admin routes.
- **Twilio signature verification**: Validate `X-Twilio-Signature` in `POST /api/twilio/inbound` using `TWILIO_AUTH_TOKEN` or `TWILIO_WEBHOOK_AUTH_TOKEN`.
- **More timezones**: Expand the timezone dropdown or use a timezone picker.
- **Message tags**: Optional tags on templates and filter by tag in the selector.
- **Rate limiting**: Limit “Send now” and test sends per recipient to avoid abuse.
- **Audit log**: Log admin actions (create/update/delete recipients and templates) for accountability.
# in-your-corner

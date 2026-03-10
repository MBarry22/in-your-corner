# Deploy In Your Corner to Vercel (8 AM Calgary daily messages)

Follow these steps so your app runs on Vercel and recipients get their daily message at **8:00 AM Calgary time**.

---

## 1. Production database

You need a **PostgreSQL** database that Vercel can reach (not localhost).

**Options:**

| Provider | Notes |
|----------|--------|
| **Vercel Postgres** | In Vercel dashboard: Storage → Create Database → Postgres. Easiest; same account. |
| **Neon** | Free tier, quick. Create project, copy connection string (use **pooled** if offered). |
| **Supabase** | Free tier. Project Settings → Database → Connection string (URI). |
| **Railway / Render** | Also work; add a Postgres service and copy `DATABASE_URL`. |

- Create the database and copy the **connection string** (e.g. `postgresql://user:pass@host:5432/dbname?sslmode=require`).
- If the URL has no `?sslmode=require`, add it for most cloud DBs:  
  `postgresql://...?sslmode=require`

---

## 2. Push code to GitHub

If the project isn’t in a Git repo yet:

```bash
cd in-your-corner
git init
git add .
git commit -m "Initial commit"
```

Create a new repo on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## 3. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub is easiest).
2. **Add New** → **Project**.
3. **Import** your GitHub repo (`in-your-corner`).
4. **Root Directory**: leave as `.` (or set to the folder that contains `package.json` if the repo is a monorepo).
5. **Framework Preset**: Next.js (should be detected).
6. **Build Command**: `prisma generate && next build` (or leave default; it’s already in `package.json`).
7. Do **not** deploy yet. Click **Environment Variables** first.

---

## 4. Environment variables

Add these in the Vercel project (Settings → Environment Variables). Use **Production** (and optionally Preview if you want).

| Variable | Required | Example / notes |
|----------|----------|------------------|
| `DATABASE_URL` | Yes | `postgresql://user:pass@host:5432/db?sslmode=require` from step 1. |
| `TWILIO_ACCOUNT_SID` | Yes | From Twilio Console. |
| `TWILIO_AUTH_TOKEN` | Yes | From Twilio Console. |
| `TWILIO_PHONE_NUMBER` | Yes | E.164, e.g. `+15551234567`. Must be a number on your Twilio account. |
| `CRON_SECRET` | Yes for cron | Long random string (e.g. 32 chars). Use alphanumeric only so the header is valid. |
| `OPENAI_API_KEY` | If using AI | From OpenAI. |
| `USE_AI_DAILY_MESSAGE` | Optional | Set to `true` to use AI-generated daily message. |
| `APP_TIMEZONE` | Optional | Default `America/Edmonton` (Calgary). |
| `NEXT_PUBLIC_APP_NAME` | Optional | e.g. `In Your Corner`. |
| `TWILIO_WEBHOOK_AUTH_TOKEN` | Optional | For inbound webhook validation. |

**Generate a safe CRON_SECRET** (no quotes, no newlines):

```bash
# Example (run in terminal):
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

Paste the output into `CRON_SECRET` on Vercel.

---

## 5. Create tables in production (first time only)

After the first deploy, your app will run but the database will be empty. Create tables using your **production** `DATABASE_URL`:

**Option A – Use Vercel’s DATABASE_URL from the dashboard**

1. In Vercel: Project → Settings → Environment Variables.
2. Copy the value of `DATABASE_URL` (or reveal and copy).
3. Locally, run (paste the real URL):

```bash
cd in-your-corner
set DATABASE_URL=postgresql://...your-production-url...
npx prisma db push
```

On macOS/Linux use `export DATABASE_URL=...` instead of `set`.

**Option B – Use .env.production**

Create a local `.env.production` with only:

```env
DATABASE_URL="postgresql://...your-production-url..."
```

Then:

```bash
npx prisma db push
```

(Do not commit `.env.production`.)

After this, the Production DB will have all tables (Recipients, MessageTemplates, MessageLog, DailyContent, etc.).

---

## 6. (Optional) Seed message templates

If you use the seed file to load default templates:

```bash
# With production DATABASE_URL set as above
npx prisma db seed
```

---

## 7. Cron job (8 AM Calgary)

The app’s cron is already configured in `vercel.json`:

- **Path:** `/api/cron/send-daily-support`
- **Schedule:** every 15 minutes (`*/15 * * * *`)

Recipients with **timezone America/Edmonton** and **send time 8:00** get their message when the cron runs during **8:00–8:15 AM Calgary**. No extra setup needed beyond `CRON_SECRET`.

**Vercel plan:** Cron jobs require a **Pro** (or Enterprise) plan. On the Hobby plan, crons do not run.

**How auth works:** When `CRON_SECRET` is set in Vercel, Vercel sends it as `Authorization: Bearer <CRON_SECRET>` when it calls your cron URL. Your route already checks this, so the endpoint stays secure.

**If you’re on Hobby:** Use an external cron (e.g. [cron-job.org](https://cron-job.org)) to call your endpoint once in the 8 AM window:

- URL: `https://YOUR_VERCEL_DOMAIN.vercel.app/api/cron/send-daily-support?secret=YOUR_CRON_SECRET`
- Schedule: daily at **15:00 UTC** (8 AM Calgary in winter) or **14:00 UTC** (8 AM Calgary in summer). Or run every 15 minutes between 14:00 and 15:00 UTC to be safe.

---

## 8. Twilio webhook (inbound SMS)

So that STOP / START / HELP and inbound replies work:

1. Twilio Console → Phone Numbers → your number → Messaging.
2. **A MESSAGE COMES IN** Webhook:  
   `https://YOUR_VERCEL_DOMAIN.vercel.app/api/twilio/inbound`  
   Method: **POST**.
3. Save.

Use your real Vercel URL (e.g. `https://in-your-corner-xxx.vercel.app`).

---

## 9. Verify before tomorrow

1. **Recipients:** In the deployed app, add at least one recipient with:
   - Phone (E.164),
   - Timezone: **America/Edmonton**,
   - Send time: **8** hour, **0** minute,
   - Active, not paused.

2. **Send now:** Use “Send now” for that recipient and confirm they receive the SMS and it appears in Logs.

3. **Cron (Pro):** After a deploy, in Vercel → Project → Cron Jobs you should see the job. Next run time will be listed. You can also trigger a test run (if available) or wait for the next 15‑minute tick and check Logs.

4. **Cron (external):** If using cron-job.org, run it once manually and check Logs for a new “sent” entry.

---

## 10. Checklist

- [ ] Production Postgres created and `DATABASE_URL` in Vercel.
- [ ] All Twilio env vars in Vercel; `TWILIO_PHONE_NUMBER` is E.164 and belongs to your account.
- [ ] `CRON_SECRET` set (alphanumeric, no newlines).
- [ ] Code pushed to GitHub and project imported in Vercel.
- [ ] Environment variables added, then **Redeploy** (or deploy) so they’re applied.
- [ ] `npx prisma db push` run once against production `DATABASE_URL`.
- [ ] (Optional) `npx prisma db seed` for templates.
- [ ] At least one active recipient with 8:00 AM America/Edmonton.
- [ ] “Send now” tested and SMS received.
- [ ] Twilio webhook URL updated to your Vercel domain.
- [ ] Vercel Pro (so crons run) or external cron configured for 8 AM Calgary.

Once this is done, tomorrow morning at 8 AM Calgary your users will get their daily message.

# PhysiqueLens (Commercial MVP Foundation)

PhysiqueLens is an English web app for simulated physique assessment with a production-ready commercial foundation.

Core user flow:
- Landing page
- Photo upload (front/side/back)
- Questionnaire
- Stripe checkout (when paid access is required)
- Processing screen
- Report dashboard

This MVP **does not use real AI image recognition** and **does not call external AI APIs**.
It uses questionnaire-based mock logic to generate a professional-style report demo.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- lucide-react
- NextAuth (credentials auth)
- Prisma + PostgreSQL
- Stripe Checkout + webhook verification

## Commercial Features Included

- Account sign-up / sign-in with protected app routes.
- Server-side submission creation and report generation access checks.
- Stripe checkout session creation and webhook-based payment confirmation.
- Paid credits and report usage tracking per user.
- Persistent storage for submissions, reports, and payments.
- Account page showing recent payments and reports.

## Pricing Logic

- Every generated report requires 1 paid credit
- Price options in checkout page:
  - USD 5
  - CNY 10

## Environment Variables

Create `.env` from `.env.example` and set:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_APP_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_USD_5=
STRIPE_PRICE_CNY_10=
```

## Database Setup

```bash
npx prisma generate
npx prisma migrate dev --name init_commercial_mvp
```

## Run Locally

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init_commercial_mvp
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run lint
npm run build
npm run start
```

## Deploy to Vercel

1. Push this project to GitHub.
2. Import the repo in Vercel.
3. Framework preset: Next.js.
4. Add required environment variables in Vercel project settings.
5. Configure Stripe webhook endpoint to:
   - `https://<your-domain>/api/checkout/webhook`
6. Add your custom domain.

## Important Disclaimer

PhysiqueLens uses simulated AI-style visual analysis in this version.
It is not medical advice, does not diagnose health conditions, and does not guarantee fitness results.

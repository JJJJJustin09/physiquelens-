# PhysiqueLens (Website MVP)

PhysiqueLens is an English web app MVP for simulated physique assessment.

Core flow:
- Landing page
- Photo upload (front/side/back)
- Questionnaire
- Processing screen
- Report dashboard

This MVP **does not use real AI image recognition** and **does not call external AI APIs**.
It uses questionnaire-based mock logic to generate a professional-style report demo.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- lucide-react
- localStorage (no backend / no database)

## Pricing Logic in MVP

- First report: free
- Second report onward: checkout required
- Price options in checkout page:
  - USD 5 (global default)
  - CNY 10 (Mainland China option)

Payment is currently simulated locally (no real payment gateway connected yet).

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run lint
npm run build -- --webpack
npm run start
```

## Deploy as a Website (Vercel)

1. Push this project to GitHub.
2. Import the repo in Vercel.
3. Framework preset: Next.js.
4. Build command: `npm run build -- --webpack`
5. Output: default Next.js output.
6. Add your custom domain.

## Important Disclaimer

PhysiqueLens MVP uses simulated AI-style visual analysis.
It is not medical advice, does not diagnose health conditions, and does not guarantee fitness results.

## Suggested Next Steps

- Integrate real payment providers:
  - Stripe for global card payments (USD)
  - WeChat Pay / Alipay via supported PSP for CNY
- Add server-side payment verification (webhooks)
- Add user accounts and report history
- Add real image-analysis pipeline in a future version

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/stripe";

const bodySchema = z
  .object({
    submissionId: z.string().min(1).optional(),
  })
  .strict();

const checkoutEnvSchema = z.object({
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_PRICE_ID: z.string().min(1),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
});

function getModeFromSecretKey(key: string): "test" | "live" | "unknown" {
  if (key.startsWith("sk_test_")) return "test";
  if (key.startsWith("sk_live_")) return "live";
  return "unknown";
}

function getModeFromPublishableKey(key: string): "test" | "live" | "unknown" {
  if (key.startsWith("pk_test_")) return "test";
  if (key.startsWith("pk_live_")) return "live";
  return "unknown";
}

export async function POST(request: Request) {
  try {
    const env = checkoutEnvSchema.parse({
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    });

    const stripe = getStripeClient(env.STRIPE_SECRET_KEY);
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json().catch(() => null);
    const parsed = bodySchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
    }

    if (parsed.data.submissionId) {
      const submission = await prisma.submission.findFirst({
        where: {
          id: parsed.data.submissionId,
          userId: session.user.id,
        },
        select: { id: true },
      });
      if (!submission) {
        return NextResponse.json(
          { error: "Submission not found. Please submit the questionnaire again." },
          { status: 404 },
        );
      }
    }

    const stripePrice = await stripe.prices.retrieve(env.STRIPE_PRICE_ID);
    const unitAmount = stripePrice.unit_amount;
    if (!stripePrice.active) {
      return NextResponse.json(
        { error: "Stripe price is inactive. Activate the price and retry." },
        { status: 500 },
      );
    }
    if (stripePrice.currency !== "usd" || unitAmount !== 500) {
      return NextResponse.json(
        {
          error:
            "Stripe price must be configured as a one-time USD $5 amount (currency usd, unit_amount 500).",
        },
        { status: 500 },
      );
    }

    const secretKeyMode = getModeFromSecretKey(env.STRIPE_SECRET_KEY);
    const priceMode = stripePrice.livemode ? "live" : "test";
    if (secretKeyMode !== "unknown" && secretKeyMode !== priceMode) {
      return NextResponse.json(
        {
          error:
            "Stripe mode mismatch: STRIPE_SECRET_KEY and STRIPE_PRICE_ID are not in the same mode (test/live).",
        },
        { status: 500 },
      );
    }
    if (env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      const publishableKeyMode = getModeFromPublishableKey(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      if (publishableKeyMode !== "unknown" && publishableKeyMode !== priceMode) {
        return NextResponse.json(
          {
            error:
              "Stripe mode mismatch: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and STRIPE_PRICE_ID are not in the same mode (test/live).",
          },
          { status: 500 },
        );
      }
    }

    const requestOrigin = new URL(request.url).origin;
    const appUrl = env.NEXT_PUBLIC_APP_URL ?? env.NEXTAUTH_URL ?? requestOrigin ?? "http://localhost:3000";
    const submissionQuery = parsed.data.submissionId
      ? `&submission_id=${encodeURIComponent(parsed.data.submissionId)}`
      : "";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email,
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        submissionId: parsed.data.submissionId ?? "",
        priceId: env.STRIPE_PRICE_ID,
      },
      success_url: `${appUrl}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}${submissionQuery}`,
      cancel_url: `${appUrl}/checkout?status=cancel${submissionQuery}`,
    });

    await prisma.payment.create({
      data: {
        userId: session.user.id,
        stripeCheckoutSessionId: checkoutSession.id,
        amount: unitAmount,
        currency: stripePrice.currency,
        creditsPurchased: 1,
        status: "PENDING",
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Stripe checkout URL is unavailable." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: checkoutSession.url, sessionId: checkoutSession.id });
  } catch (error) {
    console.error("Failed to initialize Stripe checkout session:", error);
    const details = error instanceof Error ? error.message : "Unknown checkout error.";
    return NextResponse.json(
      { error: "Failed to initialize checkout session.", details },
      { status: 500 },
    );
  }
}

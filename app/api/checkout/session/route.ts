import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/stripe";

const bodySchema = z.object({
  priceOption: z.enum(["USD_5", "CNY_10"]),
  submissionId: z.string().min(1),
});

export async function POST(request: Request) {
  const env = getEnv();
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

  const priceId =
    parsed.data.priceOption === "USD_5" ? env.STRIPE_PRICE_USD_5 : env.STRIPE_PRICE_CNY_10;

  const appUrl =
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId: session.user.id,
      submissionId: parsed.data.submissionId,
      priceOption: parsed.data.priceOption,
    },
    success_url: `${appUrl}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}&submission_id=${encodeURIComponent(parsed.data.submissionId)}`,
    cancel_url: `${appUrl}/checkout?status=cancel&submission_id=${encodeURIComponent(parsed.data.submissionId)}`,
  });

  await prisma.payment.create({
    data: {
      userId: session.user.id,
      stripeCheckoutSessionId: checkoutSession.id,
      amount: parsed.data.priceOption === "USD_5" ? 500 : 1000,
      currency: parsed.data.priceOption === "USD_5" ? "usd" : "cny",
      creditsPurchased: 1,
      status: "PENDING",
    },
  });

  return NextResponse.json({ checkoutUrl: checkoutSession.url });
}

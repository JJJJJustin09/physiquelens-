import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PaymentStatus } from "@prisma/client";
import { getEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const env = getEnv();
  const stripe = getStripeClient(env.STRIPE_SECRET_KEY);
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${(error as Error).message}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (!userId) {
      return NextResponse.json({ received: true });
    }

    await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: {
          stripeCheckoutSessionId: session.id,
        },
      });
      if (!payment) return;

      const succeeded = session.payment_status === "paid";
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: succeeded ? PaymentStatus.SUCCEEDED : PaymentStatus.FAILED,
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
          stripeCustomerId:
            typeof session.customer === "string" ? session.customer : null,
        },
      });

      if (succeeded) {
        await tx.user.update({
          where: { id: userId },
          data: {
            paidCredits: { increment: payment.creditsPurchased },
          },
        });
      }
    });
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    await prisma.payment.updateMany({
      where: {
        stripeCheckoutSessionId: session.id,
        status: PaymentStatus.PENDING,
      },
      data: { status: PaymentStatus.CANCELED },
    });
  }

  return NextResponse.json({ received: true });
}

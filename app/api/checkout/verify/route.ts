import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { PaymentStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const querySchema = z.object({
  sessionId: z.string().min(1),
});

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    sessionId: searchParams.get("session_id"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Missing checkout session id." }, { status: 400 });
  }

  const payment = await prisma.payment.findFirst({
    where: {
      userId: session.user.id,
      stripeCheckoutSessionId: parsed.data.sessionId,
    },
    select: {
      id: true,
      status: true,
      updatedAt: true,
    },
  });

  if (!payment) {
    return NextResponse.json({ status: "not_found" }, { status: 404 });
  }

  const statusMap: Record<PaymentStatus, "pending" | "succeeded" | "failed" | "canceled"> = {
    PENDING: "pending",
    SUCCEEDED: "succeeded",
    FAILED: "failed",
    CANCELED: "canceled",
  };

  return NextResponse.json({
    status: statusMap[payment.status],
    updatedAt: payment.updatedAt.toISOString(),
  });
}

import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

export async function getUserBillingState(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      paidCredits: true,
      reportsGenerated: true,
      payments: {
        where: {
          status: PaymentStatus.SUCCEEDED,
        },
        select: { id: true, amount: true, currency: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) return null;

  return {
    completedReports: user.reportsGenerated,
    paidCredits: user.paidCredits,
    totalPayments: user.payments.length,
    freeReportRemaining: user.reportsGenerated === 0,
    canStartNewAnalysis: user.reportsGenerated === 0 || user.paidCredits > 0,
    lastPayment:
      user.payments[0] != null
        ? {
            amount: user.payments[0].amount,
            currency: user.payments[0].currency,
            timestamp: user.payments[0].createdAt.toISOString(),
          }
        : null,
  };
}

export async function consumeUserAnalysisAccess(userId: string, accessType: "free" | "paid") {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { paidCredits: true, reportsGenerated: true },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    if (accessType === "free") {
      if (user.reportsGenerated > 0) {
        throw new Error("Free report has already been used.");
      }
      return tx.user.update({
        where: { id: userId },
        data: {
          reportsGenerated: { increment: 1 },
        },
      });
    }

    if (user.paidCredits <= 0) {
      throw new Error("No paid credits available.");
    }

    return tx.user.update({
      where: { id: userId },
      data: {
        reportsGenerated: { increment: 1 },
        paidCredits: { decrement: 1 },
      },
    });
  });
}

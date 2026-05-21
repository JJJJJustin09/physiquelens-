import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserBillingState } from "@/lib/server-billing";

const bodySchema = z.object({
  photoMeta: z.object({
    frontSelected: z.boolean(),
    sideSelected: z.boolean(),
    backSelected: z.boolean(),
    frontFileName: z.string().optional(),
    sideFileName: z.string().optional(),
    backFileName: z.string().optional(),
    updatedAt: z.string(),
  }),
  questionnaire: z.object({
    primaryGoal: z.enum([
      "Build a V-taper",
      "Wider shoulders",
      "Bigger arms",
      "More balanced physique",
      "Leaner / more definition",
      "Better chest development",
      "General aesthetic improvement",
    ]),
    trainingExperience: z.enum([
      "Beginner",
      "Less than 6 months",
      "6–12 months",
      "1–2 years",
      "2+ years",
    ]),
    weeklyFrequency: z.enum(["0–2 days", "3–4 days", "5+ days"]),
    equipmentAccess: z.enum([
      "Full gym",
      "Dumbbells only",
      "Bodyweight only",
      "Mixed / limited equipment",
    ]),
    injuryOrPain: z.enum(["No", "Yes", "Not sure"]),
    focusArea: z.enum(["Back", "Shoulders", "Arms", "Chest", "Legs", "Core", "Not sure"]),
  }),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission payload." }, { status: 400 });
  }

  const photoMeta = parsed.data.photoMeta;
  if (!photoMeta.frontSelected || !photoMeta.sideSelected || !photoMeta.backSelected) {
    return NextResponse.json(
      { error: "Front, side, and back photos must be selected." },
      { status: 400 },
    );
  }

  const billing = await getUserBillingState(session.user.id);
  if (!billing) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  if (billing.paidCredits <= 0) {
    return NextResponse.json(
      {
        error: "Payment required before generating the next report.",
        code: "PAYMENT_REQUIRED",
      },
      { status: 402 },
    );
  }

  const submission = await prisma.submission.create({
    data: {
      userId: session.user.id,
      photoMeta: parsed.data.photoMeta,
      questionnaire: parsed.data.questionnaire,
    },
    select: { id: true, createdAt: true },
  });

  return NextResponse.json({
    submissionId: submission.id,
    createdAt: submission.createdAt.toISOString(),
  });
}

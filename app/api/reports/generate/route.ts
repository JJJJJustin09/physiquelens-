import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { SubmissionStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateMockReport } from "@/lib/mockReport";
import { consumeUserAnalysisAccess } from "@/lib/server-billing";
import type { QuestionnaireAnswers, Report } from "@/lib/types";

const bodySchema = z.object({
  submissionId: z.string().min(1),
  accessType: z.enum(["free", "paid"]),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const submission = await prisma.submission.findFirst({
    where: {
      id: parsed.data.submissionId,
      userId: session.user.id,
    },
    select: {
      id: true,
      status: true,
      questionnaire: true,
      report: { select: { id: true, reportPayload: true } },
    },
  });

  if (!submission) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  if (submission.report) {
    return NextResponse.json({
      submissionId: submission.id,
      report: submission.report.reportPayload as Report,
      reused: true,
    });
  }

  try {
    await consumeUserAnalysisAccess(session.user.id, parsed.data.accessType);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Access check failed.";
    return NextResponse.json({ error: message }, { status: 402 });
  }

  const questionnaire = submission.questionnaire as QuestionnaireAnswers;
  const report = generateMockReport(questionnaire);

  await prisma.$transaction(async (tx) => {
    await tx.reportRecord.create({
      data: {
        userId: session.user.id,
        submissionId: submission.id,
        overallScore: report.overallScore,
        reportPayload: report,
      },
    });

    await tx.submission.update({
      where: { id: submission.id },
      data: { status: SubmissionStatus.COMPLETED },
    });
  });

  return NextResponse.json({
    submissionId: submission.id,
    report,
    reused: false,
  });
}

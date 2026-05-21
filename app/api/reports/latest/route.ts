import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Report } from "@/lib/types";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const submissionId = searchParams.get("submissionId");

  const latest = await prisma.reportRecord.findFirst({
    where: {
      userId: session.user.id,
      ...(submissionId ? { submissionId } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: { reportPayload: true, createdAt: true, submissionId: true },
  });

  if (!latest) {
    return NextResponse.json({ report: null });
  }

  return NextResponse.json({
    report: latest.reportPayload as Report,
    generatedAt: latest.createdAt.toISOString(),
    submissionId: latest.submissionId,
  });
}

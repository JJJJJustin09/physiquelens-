import type { PhotoMetaInput, QuestionnaireAnswers, Report } from "@/lib/types";

type BillingStateResponse = {
  completedReports: number;
  paidCredits: number;
  totalPayments: number;
  canStartNewAnalysis: boolean;
  lastPayment: {
    amount: number;
    currency: string;
    timestamp: string;
  } | null;
};

export async function fetchBillingStatus() {
  const response = await fetch("/api/billing/status", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch billing status.");
  }
  const payload = (await response.json()) as { billing: BillingStateResponse };
  return payload.billing;
}

export async function createSubmission(payload: {
  photoMeta: PhotoMetaInput;
  questionnaire: QuestionnaireAnswers;
}) {
  const response = await fetch("/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as
      | { error?: string; code?: string }
      | null;
    throw new Error(errorPayload?.error ?? "Unable to create submission.");
  }

  return (await response.json()) as {
    submissionId: string;
    createdAt: string;
    paymentRequired: boolean;
  };
}

export async function generateReport(payload: {
  submissionId: string;
}) {
  const response = await fetch("/api/reports/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = (await response.json().catch(() => null)) as
    | { report?: Report; error?: string; reused?: boolean }
    | null;

  if (!response.ok || !result?.report) {
    throw new Error(result?.error ?? "Failed to generate report.");
  }

  return result.report;
}

export async function fetchLatestReport(submissionId?: string) {
  const query = submissionId ? `?submissionId=${encodeURIComponent(submissionId)}` : "";
  const response = await fetch(`/api/reports/latest${query}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch latest report.");
  }
  const payload = (await response.json()) as {
    report: Report | null;
    generatedAt?: string;
    submissionId?: string;
  };
  return payload;
}

export async function createCheckoutSession(payload: { submissionId?: string }) {
  const response = await fetch("/api/checkout/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json().catch(() => null)) as
    | { url?: string; sessionId?: string; error?: string; details?: string }
    | null;

  if (!response.ok || !data?.url) {
    const msg =
      data?.details ??
      data?.error ??
      "Unable to create checkout session.";
    throw new Error(msg);
  }

  return data.url;
}

export async function verifyCheckoutSession(sessionId: string) {
  const response = await fetch(
    `/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Unable to verify payment status.");
  }
  return (await response.json()) as {
    status: "pending" | "succeeded" | "failed" | "canceled";
    updatedAt: string;
  };
}

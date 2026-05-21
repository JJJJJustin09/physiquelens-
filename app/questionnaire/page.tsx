"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { QuestionnaireForm } from "@/components/questionnaire/questionnaire-form";
import { InlineToast } from "@/components/layout/inline-toast";
import type { QuestionnaireAnswers } from "@/lib/types";
import { createSubmission, fetchBillingStatus } from "@/lib/api-client";
import { setFlowSubmission } from "@/lib/flow-storage";
import {
  getPhotoMeta,
  getQuestionnaireAnswers,
  saveQuestionnaireAnswers,
} from "@/lib/storage";

export default function QuestionnairePage() {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<Partial<QuestionnaireAnswers>>({});
  const [ready, setReady] = useState(false);
  const [canProceed, setCanProceed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [needsPayment, setNeedsPayment] = useState(false);
  const [paidCredits, setPaidCredits] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const savedAnswers = getQuestionnaireAnswers();
    const photoMeta = getPhotoMeta();

    const timer = window.setTimeout(async () => {
      if (savedAnswers) {
        setInitialValues(savedAnswers);
      }

      if (!photoMeta?.frontSelected || !photoMeta?.sideSelected || !photoMeta?.backSelected) {
        setCanProceed(false);
      }
      try {
        const billing = await fetchBillingStatus();
        setNeedsPayment(!billing.canStartNewAnalysis);
        setPaidCredits(billing.paidCredits);
      } catch {
        setApiError("Unable to load account billing status. Please refresh and try again.");
      }

      setReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = (values: QuestionnaireAnswers) => {
    const photoMeta = getPhotoMeta();
    if (!photoMeta?.frontSelected || !photoMeta?.sideSelected || !photoMeta?.backSelected) {
      setToast("Upload all three photo angles first.");
      return;
    }

    setSubmitting(true);
    setApiError(null);
    saveQuestionnaireAnswers(values);

    void (async () => {
      try {
        const submission = await createSubmission({
          photoMeta,
          questionnaire: values,
        });
        setFlowSubmission(submission.submissionId);
        if (submission.paymentRequired) {
          router.push(`/checkout?submission_id=${encodeURIComponent(submission.submissionId)}`);
          return;
        }
        router.push("/processing");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to continue. Please try again.";
        setApiError(message);
        setSubmitting(false);
      }
    })();
  };

  if (!ready) {
    return <div className="min-h-screen bg-[#05070A]" />;
  }

  return (
    <div className="min-h-screen bg-[#05070A]">
      <SiteNav ctaHref="/upload" ctaLabel="Back to Upload" />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Questionnaire</h1>
        <p className="mt-2 text-slate-300">
          Short context to tailor your simulated analysis priorities.
        </p>
        {apiError ? (
          <div className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/15 px-4 py-3 text-sm text-rose-100">
            {apiError}
          </div>
        ) : null}

        {needsPayment ? (
          <div className="mt-4 rounded-xl border border-amber-400/40 bg-amber-500/15 px-4 py-3 text-sm text-amber-100">
            Every report requires one paid credit. Please complete checkout (USD $5 per report)
            before generating analysis.
          </div>
        ) : paidCredits > 0 ? (
          <div className="mt-4 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-3 text-sm text-cyan-100">
            You have {paidCredits} paid report credit{paidCredits > 1 ? "s" : ""} available. This
            submission will use one credit.
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-amber-400/40 bg-amber-500/15 px-4 py-3 text-sm text-amber-100">
            No paid credits available. Submit this questionnaire first, then you will be taken to checkout and report generation continues automatically after successful payment.
          </div>
        )}

        {!canProceed ? (
          <div className="mt-6 rounded-2xl border border-amber-400/40 bg-amber-500/15 p-5 text-amber-100">
            <p className="text-sm">
              Upload all three photo angles first to continue.
            </p>
            <Link
              href="/upload"
              className="mt-3 inline-flex rounded-lg border border-amber-200/40 bg-amber-500/15 px-4 py-2 text-sm font-medium"
            >
              Go to Upload
            </Link>
          </div>
        ) : (
          <div className="mt-6">
            <QuestionnaireForm initialValues={initialValues} submitting={submitting} onSubmit={handleSubmit} />
          </div>
        )}

        <button
          type="button"
          onClick={() => setToast("This helps tailor priorities with simulated logic only.")}
          className="mt-4 text-sm text-slate-400 underline decoration-slate-500 underline-offset-4 transition hover:text-slate-200"
        >
          Why these questions?
        </button>
      </main>
      <SiteFooter />
      {toast ? <InlineToast message={toast} onClose={() => setToast(null)} /> : null}
    </div>
  );
}

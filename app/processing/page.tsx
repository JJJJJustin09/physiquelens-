"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProcessingSteps } from "@/components/processing/processing-steps";
import { fetchSessionStatus, generateReport } from "@/lib/api-client";
import { clearFlowSubmission, getFlowSubmission, setLatestReportSubmissionId } from "@/lib/flow-storage";
import { saveStoredReport } from "@/lib/storage";

const totalSteps = 6;

export default function ProcessingPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const finalizedRef = useRef(false);

  useEffect(() => {
    let stepTimer: number | null = null;

    const flow = getFlowSubmission();
    if (!flow) {
      router.replace("/questionnaire");
      return;
    }

    const bootTimer = window.setTimeout(() => {
      void (async () => {
        try {
          const sessionStatus = await fetchSessionStatus();
          if (!sessionStatus.authenticated) {
            router.replace(`/auth/sign-in?callbackUrl=${encodeURIComponent("/processing")}`);
            return;
          }
        } catch (sessionError) {
          console.error("Failed to verify processing session:", sessionError);
          setError("Session expired. Please sign in again.");
          router.replace(`/auth/sign-in?callbackUrl=${encodeURIComponent("/processing")}`);
          return;
        }

        stepTimer = window.setInterval(() => {
          setActiveStep((prev) => {
            if (prev >= totalSteps - 1) {
              if (stepTimer !== null) {
                window.clearInterval(stepTimer);
              }
              if (finalizedRef.current) return prev;
              finalizedRef.current = true;
              void (async () => {
                try {
                  const report = await generateReport({
                    submissionId: flow.submissionId,
                  });
                  saveStoredReport(report);
                  setLatestReportSubmissionId(flow.submissionId);
                  clearFlowSubmission();
                  window.setTimeout(() => {
                    router.replace("/report?generated=1");
                  }, 500);
                } catch (generateError) {
                  const message =
                    generateError instanceof Error
                      ? generateError.message
                      : "Failed to generate report.";
                  if (message === "Unauthorized") {
                    router.replace(`/auth/sign-in?callbackUrl=${encodeURIComponent("/processing")}`);
                    return;
                  }
                  if (message === "No paid credits available.") {
                    router.replace("/checkout");
                    return;
                  }
                  setError(message);
                }
              })();

              return prev;
            }
            return prev + 1;
          });
        }, 650);
      })();
    }, 0);

    return () => {
      window.clearTimeout(bootTimer);
      if (stepTimer !== null) {
        window.clearInterval(stepTimer);
      }
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#05070A]">
      <SiteNav ctaHref="/sample-report" ctaLabel="View Sample Report" />
      <main className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-3 text-center text-3xl font-semibold tracking-tight text-white">
          Building your report
        </h1>
        <p className="mb-8 text-center text-slate-300">
          Simulating AI-style physique assessment for MVP demo.
        </p>
        {error ? (
          <div className="mb-6 max-w-2xl rounded-xl border border-rose-400/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
        <ProcessingSteps activeStep={activeStep} />
      </main>
      <SiteFooter />
    </div>
  );
}

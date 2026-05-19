"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProcessingSteps } from "@/components/processing/processing-steps";
import { generateMockReport } from "@/lib/mockReport";
import {
  clearPendingAccess,
  finalizeReportConsumption,
  getPendingAccess,
  getQuestionnaireAnswers,
  saveStoredReport,
} from "@/lib/storage";

const totalSteps = 6;

export default function ProcessingPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const finalizedRef = useRef(false);

  useEffect(() => {
    const answers = getQuestionnaireAnswers();
    const access = getPendingAccess();

    if (!answers || !access) {
      router.replace("/questionnaire");
      return;
    }

    const stepTimer = window.setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= totalSteps - 1) {
          window.clearInterval(stepTimer);
          if (finalizedRef.current) return prev;
          finalizedRef.current = true;

          const report = generateMockReport(answers);
          saveStoredReport(report);
          finalizeReportConsumption(access.type);
          clearPendingAccess();

          window.setTimeout(() => {
            router.replace("/report?generated=1");
          }, 500);

          return prev;
        }
        return prev + 1;
      });
    }, 650);

    return () => window.clearInterval(stepTimer);
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
        <ProcessingSteps activeStep={activeStep} />
      </main>
      <SiteFooter />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { InlineToast } from "@/components/layout/inline-toast";
import { ReportShell } from "@/components/report/report-shell";
import type { Report } from "@/lib/types";
import { clearAnalysisState, getBillingState, getStoredReport } from "@/lib/storage";
import { getDefaultSampleReport } from "@/lib/mockReport";
import { Panel } from "@/components/layout/ui";

export default function ReportPage() {
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | undefined>(undefined);
  const [toast, setToast] = useState<{ message: string; variant: "info" | "success" } | null>(null);
  const [billingSummary, setBillingSummary] = useState<{
    completedReports: number;
    totalPayments: number;
    paidCredits: number;
  } | null>(null);

  useEffect(() => {
    const stored = getStoredReport();
    const timer = window.setTimeout(() => {
      if (!stored) {
        const sample = getDefaultSampleReport();
        sample.isSample = true;
        setReport(sample);
        setFallbackNotice("No saved analysis found. Showing sample report.");
        const billing = getBillingState();
        setBillingSummary({
          completedReports: billing.completedReports,
          totalPayments: billing.totalPayments,
          paidCredits: billing.paidCredits,
        });
        return;
      }

      setReport(stored);
      const billing = getBillingState();
      setBillingSummary({
        completedReports: billing.completedReports,
        totalPayments: billing.totalPayments,
        paidCredits: billing.paidCredits,
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("generated") === "1") {
      const timer = window.setTimeout(() => {
        setToast({ message: "Report generated", variant: "success" });
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const handleReset = () => {
    clearAnalysisState();
    setToast({ message: "Analysis reset", variant: "info" });
    window.setTimeout(() => {
      router.push("/upload");
    }, 500);
  };

  const handlePdf = () => {
    setToast({ message: "PDF export will be added in a future version.", variant: "info" });
  };

  return (
    <div className="min-h-screen bg-[#05070A]">
      <SiteNav ctaHref="/upload" ctaLabel="New Analysis" />
      <main>
        {billingSummary ? (
          <div className="mx-auto mt-6 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Panel className="p-4 text-sm text-slate-300">
              Usage: {billingSummary.completedReports} report(s) generated.{" "}
              {billingSummary.completedReports === 0
                ? "First report free is still available."
                : `Payments completed: ${billingSummary.totalPayments}. Paid credits left: ${billingSummary.paidCredits}.`}
            </Panel>
          </div>
        ) : null}
        {report ? (
          <ReportShell
            report={report}
            fallbackNotice={fallbackNotice}
            onReset={handleReset}
            onPdfClick={handlePdf}
          />
        ) : null}
      </main>
      <SiteFooter />
      {toast ? <InlineToast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} /> : null}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { InlineToast } from "@/components/layout/inline-toast";
import { ReportShell } from "@/components/report/report-shell";
import { clearAnalysisState } from "@/lib/storage";
import { getDefaultSampleReport } from "@/lib/mockReport";

export default function SampleReportPage() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);

  const sampleReport = useMemo(() => {
    const data = getDefaultSampleReport();
    data.isSample = true;
    return data;
  }, []);

  return (
    <div className="min-h-screen bg-[#05070A]">
      <SiteNav ctaHref="/upload" ctaLabel="Generate Report" />
      <main>
        <ReportShell
          report={sampleReport}
          showSampleBanner
          onReset={() => {
            clearAnalysisState();
            setToast("Analysis reset");
            window.setTimeout(() => router.push("/upload"), 450);
          }}
          onPdfClick={() => setToast("PDF export will be added in a future version.")}
        />
      </main>
      <SiteFooter />
      {toast ? <InlineToast message={toast} onClose={() => setToast(null)} /> : null}
    </div>
  );
}

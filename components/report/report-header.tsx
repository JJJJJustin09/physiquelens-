"use client";

import Link from "next/link";
import { CalendarDays, Download, RotateCcw } from "lucide-react";
import { Pill, Panel } from "@/components/layout/ui";

type ReportHeaderProps = {
  generatedAt: string;
  onReset: () => void;
  onPdfClick: () => void;
};

export function ReportHeader({ generatedAt, onReset, onPdfClick }: ReportHeaderProps) {
  const date = new Date(generatedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Panel className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Pill>MVP Demo Analysis</Pill>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <CalendarDays className="h-3.5 w-3.5" />
              {date}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Your Physique Report
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" />
            Start New Analysis
          </button>
          <Link
            href="/sample-report"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            View Sample Report
          </Link>
          <button
            onClick={onPdfClick}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/25"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>
    </Panel>
  );
}

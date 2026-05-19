import { Panel } from "@/components/layout/ui";
import { RadarScoreChart } from "@/components/report/radar-score-chart";
import { PriorityBarChart } from "@/components/report/priority-bar-chart";
import { getDefaultSampleReport } from "@/lib/mockReport";

const report = getDefaultSampleReport();

export function HeroPreviewCard() {
  return (
    <Panel className="overflow-hidden p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">Dashboard Preview</p>
        <p className="rounded-full border border-cyan-400/40 bg-cyan-500/15 px-2.5 py-1 text-xs text-cyan-100">
          Confidence: Medium-high
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Overall Physique Development Score</p>
          <p className="mt-2 text-3xl font-semibold text-white">72/100</p>
          <p className="mt-3 text-xs text-slate-400">Top priorities: Back Width, Side Delts, Arm Fullness</p>
          <div className="mt-4 h-px bg-white/10" />
          <p className="mt-3 text-xs text-slate-400">
            Simulated AI-style visual assessment for product demo
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="mb-2 text-sm text-slate-400">Mini radar</p>
          <RadarScoreChart scores={report.scores} compact />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-2 text-sm text-slate-400">Mini priority ratio bars</p>
        <PriorityBarChart trainingPriority={report.trainingPriority} compact />
      </div>
    </Panel>
  );
}

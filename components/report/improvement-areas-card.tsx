import type { Report } from "@/lib/types";
import { Panel } from "@/components/layout/ui";

const priorityTone: Record<string, string> = {
  High: "text-rose-200 bg-rose-500/15 border-rose-400/40",
  "Medium-high": "text-amber-200 bg-amber-500/15 border-amber-400/40",
  Medium: "text-sky-200 bg-sky-500/15 border-sky-400/40",
  Maintenance: "text-emerald-200 bg-emerald-500/15 border-emerald-400/40",
  Monitor: "text-slate-200 bg-slate-500/20 border-slate-400/30",
  Low: "text-slate-200 bg-slate-500/20 border-slate-400/30",
};

type ImprovementAreasCardProps = {
  items: Report["improvementAreas"];
};

export function ImprovementAreasCard({ items }: ImprovementAreasCardProps) {
  return (
    <Panel className="p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-white">Main improvement areas</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.area} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-white">{item.area}</p>
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${priorityTone[item.priority]}`}
              >
                {item.priority} priority
              </span>
            </div>
            <p className="text-sm text-slate-300">{item.reason}</p>
            <p className="mt-2 text-xs text-slate-400">Confidence: {item.confidence}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

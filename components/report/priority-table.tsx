import type { Report } from "@/lib/types";
import { Panel } from "@/components/layout/ui";

type PriorityTableProps = {
  trainingPriority: Report["trainingPriority"];
};

const focusMap: Record<string, string[]> = {
  "Back width": ["Lat pulldown pattern", "Pull-up pattern", "Row pattern"],
  "Side delts": ["Dumbbell lateral raise", "Cable lateral raise", "Machine lateral raise"],
  "Arm fullness": ["Triceps extensions", "Biceps curls", "Hammer curls", "Forearm work"],
  "Upper chest": ["Incline press", "Incline dumbbell press", "Low-to-high fly pattern"],
  "Leg balance": ["Maintain with one weekly session"],
};

export function PriorityTable({ trainingPriority }: PriorityTableProps) {
  const sorted = [
    { area: "Back width", value: trainingPriority.back, reason: "Largest impact on V-taper and upper-body width" },
    { area: "Side delts", value: trainingPriority.shoulders, reason: "Improves shoulder width impression" },
    { area: "Arm fullness", value: trainingPriority.arms, reason: "Improves arm-to-torso balance" },
    { area: "Upper chest", value: trainingPriority.chest, reason: "Improves front-body fullness" },
    { area: "Leg balance", value: trainingPriority.legs, reason: "Already relatively balanced" },
  ].sort((a, b) => b.value - a.value);

  return (
    <Panel className="overflow-hidden p-0">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <h3 className="text-lg font-semibold text-white">Improvement priorities</h3>
      </div>
      <div className="divide-y divide-white/10">
        {sorted.map((row, index) => (
          <div key={row.area} className="grid gap-4 px-5 py-4 sm:px-6 lg:grid-cols-[120px,180px,1fr,1fr]">
            <p className="text-sm font-medium text-cyan-200">Priority {index + 1}</p>
            <p className="text-sm font-medium text-white">{row.area}</p>
            <p className="text-sm text-slate-300">{row.reason}</p>
            <p className="text-sm text-slate-400">Suggested focus: {focusMap[row.area].join(" · ")}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

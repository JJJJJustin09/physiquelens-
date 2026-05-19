import { CheckCircle2, Lock } from "lucide-react";
import { Panel } from "@/components/layout/ui";

const checklist = [
  "Full body visible",
  "Good lighting",
  "Neutral standing pose",
  "Fitted clothing",
  "Camera around chest or waist height",
  "No extreme mirror distortion",
  "Avoid flexing or bodybuilding poses",
  "Use the same distance and angle for future progress comparisons",
];

export function PhotoChecklist() {
  return (
    <Panel className="p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-white">Photo Quality Checklist</h3>
      <ul className="mt-4 space-y-2 text-sm text-slate-300">
        {checklist.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-cyan-100">Better photos produce more reliable reports.</p>
      <div className="mt-4 rounded-xl border border-slate-400/30 bg-slate-800/40 p-3 text-sm text-slate-300">
        <p className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-slate-300" />
          In this MVP, photos are used only for local preview and are not sent to a server.
        </p>
      </div>
    </Panel>
  );
}

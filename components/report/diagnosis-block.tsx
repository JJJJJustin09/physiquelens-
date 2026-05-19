import type { Report } from "@/lib/types";
import { Panel } from "@/components/layout/ui";

type DiagnosisBlockProps = {
  diagnosis: Report["diagnoses"][number];
};

export function DiagnosisBlock({ diagnosis }: DiagnosisBlockProps) {
  return (
    <Panel className="p-5 sm:p-6">
      <h4 className="text-lg font-semibold text-white">{diagnosis.title}</h4>
      <p className="mt-3 text-sm leading-6 text-slate-300">{diagnosis.observation}</p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-slate-200">Likely reasons</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-400">
            {diagnosis.likelyReasons.map((reason) => (
              <li key={reason}>• {reason}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">Improvement direction</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-400">
            {diagnosis.improvementDirection.map((direction) => (
              <li key={direction}>• {direction}</li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}

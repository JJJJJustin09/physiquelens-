import { AlertTriangle } from "lucide-react";
import { Panel } from "@/components/layout/ui";

type ConfidenceLimitationsCardProps = {
  confidence: string;
  limitations: string[];
  cautionNotes: string[];
};

export function ConfidenceLimitationsCard({
  confidence,
  limitations,
  cautionNotes,
}: ConfidenceLimitationsCardProps) {
  return (
    <Panel className="p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-300" />
        <h3 className="text-lg font-semibold text-white">Confidence & limitations</h3>
      </div>
      <p className="mb-4 text-sm text-slate-300">Confidence level: {confidence}</p>
      <ul className="space-y-2 text-sm text-slate-400">
        {limitations.map((line) => (
          <li key={line}>• {line}</li>
        ))}
      </ul>

      {cautionNotes.length > 0 ? (
        <div className="mt-5 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4">
          <p className="text-sm font-medium text-amber-200">Additional notes</p>
          <ul className="mt-2 space-y-1 text-sm text-amber-100/90">
            {cautionNotes.map((line) => (
              <li key={line}>• {line}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </Panel>
  );
}

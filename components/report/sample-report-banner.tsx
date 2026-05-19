import { FlaskConical } from "lucide-react";

export function SampleReportBanner() {
  return (
    <div className="mb-6 rounded-2xl border border-violet-400/40 bg-violet-500/12 px-4 py-3 text-sm text-violet-100">
      <div className="flex items-center gap-2">
        <FlaskConical className="h-4 w-4" />
        <p>Sample report — for demonstration only.</p>
      </div>
    </div>
  );
}

import { Info } from "lucide-react";
import { Panel } from "@/components/layout/ui";

export function DisclaimerCard() {
  return (
    <Panel className="border-cyan-400/30 bg-cyan-500/10 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-cyan-200" />
        <p className="text-sm leading-6 text-cyan-50">
          PhysiqueLens MVP uses simulated AI-style visual analysis. It is not medical advice, does
          not diagnose health conditions, and does not guarantee specific fitness results. Scores may
          be affected by photo angle, lighting, clothing, and pose.
        </p>
      </div>
    </Panel>
  );
}

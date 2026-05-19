import { CheckCircle2 } from "lucide-react";
import { Panel } from "@/components/layout/ui";

type StrengthsCardProps = {
  strengths: string[];
};

export function StrengthsCard({ strengths }: StrengthsCardProps) {
  return (
    <Panel className="p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-white">Strengths</h3>
      <ul className="mt-4 space-y-3">
        {strengths.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
            {item}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

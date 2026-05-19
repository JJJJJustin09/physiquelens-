import type { ReactNode } from "react";
import { Panel } from "@/components/layout/ui";

type ReportSummaryCardProps = {
  title: string;
  value: string;
  icon?: ReactNode;
  description?: string;
};

export function ReportSummaryCard({ title, value, icon, description }: ReportSummaryCardProps) {
  return (
    <Panel className="p-5">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        {icon ? <span className="text-cyan-300">{icon}</span> : null}
      </div>
      <p className="text-xl font-semibold text-white">{value}</p>
      {description ? <p className="mt-2 text-sm text-slate-400">{description}</p> : null}
    </Panel>
  );
}

import type { ReactNode } from "react";
import { Panel } from "@/components/layout/ui";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Panel className="p-5 transition hover:border-cyan-400/25 hover:bg-slate-900/90">
      <div className="mb-3 inline-flex rounded-xl border border-cyan-400/40 bg-cyan-500/15 p-2 text-cyan-200">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </Panel>
  );
}

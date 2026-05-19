import { Panel } from "@/components/layout/ui";

type StepCardProps = {
  step: string;
  title: string;
  description: string;
};

export function StepCard({ step, title, description }: StepCardProps) {
  return (
    <Panel className="p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{step}</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </Panel>
  );
}

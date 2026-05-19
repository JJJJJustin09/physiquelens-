import { Panel } from "@/components/layout/ui";

type PrivacyPanelProps = {
  title: string;
  text: string;
};

export function PrivacyPanel({ title, text }: PrivacyPanelProps) {
  return (
    <Panel className="p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
    </Panel>
  );
}

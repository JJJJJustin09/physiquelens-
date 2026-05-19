"use client";

import { LoaderCircle } from "lucide-react";
import { Panel } from "@/components/layout/ui";

const steps = [
  "Checking photo completeness",
  "Reviewing photo quality",
  "Analyzing visual proportions",
  "Estimating muscle group balance",
  "Building improvement priorities",
  "Generating your report",
];

type ProcessingStepsProps = {
  activeStep: number;
};

export function ProcessingSteps({ activeStep }: ProcessingStepsProps) {
  const progress = Math.round(((activeStep + 1) / steps.length) * 100);

  return (
    <Panel className="mx-auto w-full max-w-2xl p-6 sm:p-8">
      <p className="text-sm text-cyan-200">Simulating AI-style physique assessment for MVP demo.</p>
      <div className="mt-4 h-2 rounded-full bg-slate-800">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-slate-400">{progress}% complete</p>

      <div className="mt-6 space-y-3">
        {steps.map((step, index) => {
          const isDone = index < activeStep;
          const isActive = index === activeStep;
          return (
            <div
              key={step}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm ${
                isActive
                  ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-100"
                  : isDone
                    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                    : "border-white/10 bg-white/5 text-slate-400"
              }`}
            >
              <span>{step}</span>
              {isActive ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {isDone ? <span>✓</span> : null}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

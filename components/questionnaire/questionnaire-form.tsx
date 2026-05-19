"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  EquipmentAccess,
  FocusArea,
  InjuryOrPain,
  PrimaryGoal,
  QuestionnaireAnswers,
  TrainingExperience,
  WeeklyTrainingFrequency,
} from "@/lib/types";
import { Panel } from "@/components/layout/ui";

const primaryGoalOptions: PrimaryGoal[] = [
  "Build a V-taper",
  "Wider shoulders",
  "Bigger arms",
  "More balanced physique",
  "Leaner / more definition",
  "Better chest development",
  "General aesthetic improvement",
];

const trainingExperienceOptions: TrainingExperience[] = [
  "Beginner",
  "Less than 6 months",
  "6–12 months",
  "1–2 years",
  "2+ years",
];

const frequencyOptions: WeeklyTrainingFrequency[] = ["0–2 days", "3–4 days", "5+ days"];

const equipmentOptions: EquipmentAccess[] = [
  "Full gym",
  "Dumbbells only",
  "Bodyweight only",
  "Mixed / limited equipment",
];

const injuryOptions: InjuryOrPain[] = ["No", "Yes", "Not sure"];

const focusAreaOptions: FocusArea[] = [
  "Back",
  "Shoulders",
  "Arms",
  "Chest",
  "Legs",
  "Core",
  "Not sure",
];

type QuestionnaireFormProps = {
  initialValues?: Partial<QuestionnaireAnswers>;
  onSubmit: (values: QuestionnaireAnswers) => void;
  submitting?: boolean;
};

export function QuestionnaireForm({ initialValues, onSubmit, submitting = false }: QuestionnaireFormProps) {
  const [values, setValues] = useState<QuestionnaireAnswers>({
    primaryGoal: initialValues?.primaryGoal ?? "Build a V-taper",
    trainingExperience: initialValues?.trainingExperience ?? "Beginner",
    weeklyFrequency: initialValues?.weeklyFrequency ?? "3–4 days",
    equipmentAccess: initialValues?.equipmentAccess ?? "Full gym",
    injuryOrPain: initialValues?.injuryOrPain ?? "No",
    focusArea: initialValues?.focusArea ?? "Not sure",
  });

  useEffect(() => {
    if (!initialValues) return;
    const timer = window.setTimeout(() => {
      setValues((prev) => ({
        primaryGoal: initialValues.primaryGoal ?? prev.primaryGoal,
        trainingExperience: initialValues.trainingExperience ?? prev.trainingExperience,
        weeklyFrequency: initialValues.weeklyFrequency ?? prev.weeklyFrequency,
        equipmentAccess: initialValues.equipmentAccess ?? prev.equipmentAccess,
        injuryOrPain: initialValues.injuryOrPain ?? prev.injuryOrPain,
        focusArea: initialValues.focusArea ?? prev.focusArea,
      }));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [initialValues]);

  const progress = useMemo(() => {
    const completed = Object.values(values).filter(Boolean).length;
    return Math.round((completed / 6) * 100);
  }, [values]);

  const fieldClass =
    "rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 transition hover:border-cyan-400/40";

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
    >
      <Panel className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-slate-300">Questionnaire progress</p>
          <span className="text-xs text-cyan-200">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-800">
          <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500" style={{ width: `${progress}%` }} />
        </div>
      </Panel>

      <Panel className="p-5">
        <p className="mb-3 text-sm font-medium text-slate-100">1. Primary goal</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {primaryGoalOptions.map((option) => (
            <label key={option} className={fieldClass}>
              <input
                type="radio"
                name="primaryGoal"
                className="mr-2 accent-cyan-400"
                checked={values.primaryGoal === option}
                onChange={() => setValues((prev) => ({ ...prev, primaryGoal: option }))}
              />
              {option}
            </label>
          ))}
        </div>
      </Panel>

      <Panel className="p-5">
        <p className="mb-3 text-sm font-medium text-slate-100">2. Training experience</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trainingExperienceOptions.map((option) => (
            <label key={option} className={fieldClass}>
              <input
                type="radio"
                name="trainingExperience"
                className="mr-2 accent-cyan-400"
                checked={values.trainingExperience === option}
                onChange={() => setValues((prev) => ({ ...prev, trainingExperience: option }))}
              />
              {option}
            </label>
          ))}
        </div>
      </Panel>

      <Panel className="p-5">
        <p className="mb-3 text-sm font-medium text-slate-100">3. Weekly training frequency</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {frequencyOptions.map((option) => (
            <label key={option} className={fieldClass}>
              <input
                type="radio"
                name="weeklyFrequency"
                className="mr-2 accent-cyan-400"
                checked={values.weeklyFrequency === option}
                onChange={() => setValues((prev) => ({ ...prev, weeklyFrequency: option }))}
              />
              {option}
            </label>
          ))}
        </div>
      </Panel>

      <Panel className="p-5">
        <p className="mb-3 text-sm font-medium text-slate-100">4. Equipment access</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {equipmentOptions.map((option) => (
            <label key={option} className={fieldClass}>
              <input
                type="radio"
                name="equipmentAccess"
                className="mr-2 accent-cyan-400"
                checked={values.equipmentAccess === option}
                onChange={() => setValues((prev) => ({ ...prev, equipmentAccess: option }))}
              />
              {option}
            </label>
          ))}
        </div>
      </Panel>

      <Panel className="p-5">
        <p className="mb-3 text-sm font-medium text-slate-100">5. Injury or pain</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {injuryOptions.map((option) => (
            <label key={option} className={fieldClass}>
              <input
                type="radio"
                name="injuryOrPain"
                className="mr-2 accent-cyan-400"
                checked={values.injuryOrPain === option}
                onChange={() => setValues((prev) => ({ ...prev, injuryOrPain: option }))}
              />
              {option}
            </label>
          ))}
        </div>
      </Panel>

      <Panel className="p-5">
        <p className="mb-3 text-sm font-medium text-slate-100">6. Optional focus area</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {focusAreaOptions.map((option) => (
            <label key={option} className={fieldClass}>
              <input
                type="radio"
                name="focusArea"
                className="mr-2 accent-cyan-400"
                checked={values.focusArea === option}
                onChange={() => setValues((prev) => ({ ...prev, focusArea: option }))}
              />
              {option}
            </label>
          ))}
        </div>
      </Panel>

      <Panel className="p-5 text-sm text-slate-300">
        This helps tailor the report&apos;s improvement priorities. The MVP uses simulated report logic rather than real AI.
      </Panel>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-violet-500/30 hover:brightness-110"
      >
        {submitting ? "Generating report..." : "Generate My Report"}
      </button>
    </form>
  );
}

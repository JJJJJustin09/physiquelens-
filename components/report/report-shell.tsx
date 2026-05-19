"use client";

import { BarChart3, BrainCircuit, ShieldCheck, Sparkles } from "lucide-react";
import type { Report } from "@/lib/types";
import { Panel, SectionTitle } from "@/components/layout/ui";
import { CircularScore } from "@/components/report/circular-score";
import { RadarScoreChart } from "@/components/report/radar-score-chart";
import { PriorityBarChart } from "@/components/report/priority-bar-chart";
import { ReportHeader } from "@/components/report/report-header";
import { ReportSummaryCard } from "@/components/report/report-summary-card";
import { StrengthsCard } from "@/components/report/strengths-card";
import { ImprovementAreasCard } from "@/components/report/improvement-areas-card";
import { MuscleRatingCard } from "@/components/report/muscle-rating-card";
import { DiagnosisBlock } from "@/components/report/diagnosis-block";
import { PriorityTable } from "@/components/report/priority-table";
import { ConfidenceLimitationsCard } from "@/components/report/confidence-limitations-card";
import { DisclaimerCard } from "@/components/report/disclaimer-card";
import { SampleReportBanner } from "@/components/report/sample-report-banner";

type ReportShellProps = {
  report: Report;
  showSampleBanner?: boolean;
  fallbackNotice?: string;
  onReset: () => void;
  onPdfClick: () => void;
};

export function ReportShell({
  report,
  showSampleBanner = false,
  fallbackNotice,
  onReset,
  onPdfClick,
}: ReportShellProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {showSampleBanner ? <SampleReportBanner /> : null}

      {fallbackNotice ? (
        <div className="mb-6 rounded-2xl border border-amber-400/40 bg-amber-500/15 px-4 py-3 text-sm text-amber-100">
          {fallbackNotice}
        </div>
      ) : null}

      <ReportHeader generatedAt={report.generatedAt} onReset={onReset} onPdfClick={onPdfClick} />

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ReportSummaryCard
          title="Overall Physique Development Score"
          value={`${report.overallScore}/100`}
          description="Simulated AI-style visual estimate"
          icon={<Sparkles className="h-4 w-4" />}
        />
        <ReportSummaryCard
          title="Confidence Level"
          value={report.confidence}
          description="Based on photo conditions and questionnaire context"
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <ReportSummaryCard
          title="Top 3 Improvement Priorities"
          value={report.topPriorities.join(" · ")}
          description="Where training emphasis should start"
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <ReportSummaryCard
          title="Best Current Area"
          value={report.bestArea}
          description="Current visual strength"
          icon={<BrainCircuit className="h-4 w-4" />}
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-12">
        <Panel className="p-5 sm:p-6 xl:col-span-3">
          <h3 className="mb-4 text-lg font-semibold text-white">Overall score</h3>
          <CircularScore value={report.overallScore} />
        </Panel>

        <Panel className="p-5 sm:p-6 xl:col-span-5">
          <h3 className="mb-4 text-lg font-semibold text-white">Proportion radar</h3>
          <RadarScoreChart scores={report.scores} />
        </Panel>

        <Panel className="p-5 sm:p-6 xl:col-span-4">
          <h3 className="mb-4 text-lg font-semibold text-white">Training priority ratio</h3>
          <PriorityBarChart trainingPriority={report.trainingPriority} />
        </Panel>

        <Panel className="p-5 sm:p-6 xl:col-span-12">
          <h3 className="text-lg font-semibold text-white">Competition-style scoring framework</h3>
          <p className="mt-2 text-sm text-slate-400">{report.scoringModelNote}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">Shape & symmetry</p>
              <p className="mt-1 text-xl font-semibold text-white">
                {report.competitionCriteria.shapeSymmetry}/100
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">Muscularity & condition</p>
              <p className="mt-1 text-xl font-semibold text-white">
                {report.competitionCriteria.muscularityCondition}/100
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">Presentation & poise</p>
              <p className="mt-1 text-xl font-semibold text-white">
                {report.competitionCriteria.presentationPoise}/100
              </p>
            </div>
            <div className="rounded-xl border border-cyan-400/35 bg-cyan-500/10 p-4">
              <p className="text-xs text-cyan-200">Total package</p>
              <p className="mt-1 text-xl font-semibold text-cyan-50">
                {report.competitionCriteria.totalPackage}/100
              </p>
            </div>
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6 xl:col-span-6">
          <h3 className="text-lg font-semibold text-white">AI-style summary</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">{report.aiSummary}</p>
        </Panel>

        <div className="xl:col-span-3">
          <StrengthsCard strengths={report.strengths} />
        </div>

        <div className="xl:col-span-3">
          <ImprovementAreasCard items={report.improvementAreas} />
        </div>
      </div>

      <div className="mt-12 space-y-8">
        <section>
          <SectionTitle>Overview</SectionTitle>
          <Panel className="mt-4 p-5 sm:p-6">
            <p className="text-sm leading-7 text-slate-300">
              Overall development score: <span className="font-medium text-white">{report.overallScore}/100</span>. Current visual
              impression suggests that targeted emphasis on <span className="font-medium text-white">{report.topPriorities.join(", ")}</span>{" "}
              can produce clearer changes over the next 8–12 weeks.
            </p>
            <p className="mt-3 text-sm text-slate-400">
              This helps tailor the report&apos;s improvement priorities. The MVP uses simulated report logic rather than real AI.
            </p>
            <p className="mt-3 rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
              Simulated analysis notice: this report is generated by MVP mock logic for product
              demonstration and is not medical advice.
            </p>
          </Panel>
        </section>

        <section>
          <SectionTitle>Proportion Analysis</SectionTitle>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Panel className="p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-white">V-Taper Analysis</h3>
              <p className="mt-1 text-sm text-cyan-200">{report.scores.vTaper}/100</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                The shoulder-to-waist contrast is present but not strongly defined. Increasing back width and side-delt
                development would likely create a more noticeable V-shaped upper body.
              </p>
            </Panel>

            <Panel className="p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-white">Shoulder Width Impression</h3>
              <p className="mt-1 text-sm text-cyan-200">{report.scores.shoulders}/100</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Shoulder width impression is slightly limited by lateral deltoid development. Improving the side delts can
                make the upper body appear wider without requiring major changes to waist size.
              </p>
            </Panel>

            <Panel className="p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-white">Arm-to-Torso Balance</h3>
              <p className="mt-1 text-sm text-cyan-200">{report.scores.arms}/100</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Arm size appears slightly behind torso proportion. For a more balanced visual profile, direct arm training
                should include biceps, triceps, brachialis, and forearms rather than focusing only on biceps.
              </p>
            </Panel>

            <Panel className="p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-white">Lower Body Balance</h3>
              <p className="mt-1 text-sm text-cyan-200">{report.scores.legs}/100</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Lower body proportion appears relatively balanced compared with the upper body. It can be maintained while
                upper-body width and arm fullness receive higher priority.
              </p>
            </Panel>
          </div>
        </section>

        <section>
          <SectionTitle>Muscle Group Ratings</SectionTitle>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {report.muscleRatings.map((rating) => (
              <MuscleRatingCard key={rating.area} rating={rating} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>Aesthetic Problem Diagnosis</SectionTitle>
          <div className="mt-4 space-y-4">
            {report.diagnoses.map((diagnosis) => (
              <DiagnosisBlock key={diagnosis.title} diagnosis={diagnosis} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>Improvement Priorities</SectionTitle>
          <div className="mt-4">
            <PriorityTable trainingPriority={report.trainingPriority} />
          </div>
        </section>

        <section>
          <SectionTitle>8–12 Week Direction</SectionTitle>
          <Panel className="mt-4 p-5 sm:p-6">
            <div className="grid gap-3 md:grid-cols-2">
              {report.strategy812Weeks.map((item) => (
                <div key={item.area} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">{item.area}</p>
                  <p className="text-base font-medium text-white">{item.weeklyEmphasis}</p>
                  <p className="mt-1 text-sm text-slate-300">{item.note}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-400">
              This is a strategic direction, not a medical or individualized coaching prescription.
            </p>
          </Panel>
        </section>

        <section>
          <ConfidenceLimitationsCard
            confidence={report.confidence}
            limitations={report.limitations}
            cautionNotes={report.cautionNotes}
          />
        </section>

        <section>
          <DisclaimerCard />
        </section>
      </div>
    </div>
  );
}

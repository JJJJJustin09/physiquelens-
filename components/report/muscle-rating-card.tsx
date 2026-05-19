import type { Report } from "@/lib/types";
import { Panel } from "@/components/layout/ui";

type MuscleRatingCardProps = {
  rating: Report["muscleRatings"][number];
};

function barTone(score: number) {
  if (score >= 75) return "bg-emerald-400";
  if (score >= 65) return "bg-cyan-400";
  if (score >= 55) return "bg-amber-400";
  return "bg-rose-400";
}

export function MuscleRatingCard({ rating }: MuscleRatingCardProps) {
  return (
    <Panel className="p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="font-medium text-white">{rating.area}</p>
        <p className="text-sm text-slate-300">{rating.score}/100</p>
      </div>

      <div className="h-2 rounded-full bg-slate-800">
        <div
          className={`h-2 rounded-full ${barTone(rating.score)}`}
          style={{ width: `${Math.max(0, Math.min(100, rating.score))}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-slate-200">
          Priority: {rating.priority}
        </span>
        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-slate-200">
          Confidence: {rating.confidence}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-400">{rating.explanation}</p>
    </Panel>
  );
}

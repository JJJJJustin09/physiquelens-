import { cn } from "@/lib/utils";

type CircularScoreProps = {
  value: number;
  label?: string;
  className?: string;
};

export function CircularScore({ value, label = "Development score", className }: CircularScoreProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const angle = Math.round((clamped / 100) * 360);

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className="relative grid h-40 w-40 place-items-center rounded-full"
        style={{
          background: `conic-gradient(#22d3ee ${angle}deg, rgba(148,163,184,0.2) ${angle}deg 360deg)`,
        }}
      >
        <div className="grid h-32 w-32 place-items-center rounded-full border border-white/10 bg-slate-950 text-center">
          <div>
            <p className="text-4xl font-semibold text-white">{clamped}</p>
            <p className="text-xs text-slate-400">/100</p>
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-300">{label}</p>
    </div>
  );
}

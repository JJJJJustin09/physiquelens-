import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroPreviewCard } from "@/components/landing/hero-preview-card";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.12),transparent_40%)]" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:px-8 lg:py-24">
        <div>
          <p className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cyan-100">
            PhysiqueLens MVP
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Know what to improve before you train.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Upload your physique photos and receive a professional-style body analysis report with
            development scores, proportion insights, weak point diagnosis, and improvement priorities.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/upload"
              className="btn-primary"
            >
              Generate My Report
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sample-report"
              className="btn-secondary"
            >
              View Sample Report
            </Link>
          </div>
        </div>
        <HeroPreviewCard />
      </div>
    </section>
  );
}

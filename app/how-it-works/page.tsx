import Link from "next/link";
import { ArrowRight, Brain, Camera, FileBarChart } from "lucide-react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Panel, SectionTitle } from "@/components/layout/ui";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#05070A]">
      <SiteNav ctaHref="/upload" ctaLabel="Generate Report" />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionTitle>How PhysiqueLens MVP works</SectionTitle>
        <p className="mt-3 max-w-3xl text-slate-300">
          This first version is a product demo with simulated AI-style analysis logic. It delivers a
          realistic end-to-end experience while keeping privacy-first behavior and clear limitations.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Panel className="p-5">
            <Camera className="h-5 w-5 text-cyan-200" />
            <h3 className="mt-3 text-lg font-semibold text-white">1. Photo input</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Users add front, side, and back photos. In MVP mode, photos are local preview only and
              are not sent to a server.
            </p>
          </Panel>

          <Panel className="p-5">
            <Brain className="h-5 w-5 text-cyan-200" />
            <h3 className="mt-3 text-lg font-semibold text-white">2. Simulated logic</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Questionnaire answers drive a mock report generator that adjusts priorities, confidence,
              and recommendations with deterministic logic.
            </p>
          </Panel>

          <Panel className="p-5">
            <FileBarChart className="h-5 w-5 text-cyan-200" />
            <h3 className="mt-3 text-lg font-semibold text-white">3. Professional report</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Users receive a structured report with development scores, diagnosis, training emphasis,
              and confidence notes.
            </p>
          </Panel>
        </div>

        <Panel className="mt-6 p-6">
          <h3 className="text-lg font-semibold text-white">MVP boundaries</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>• No real image recognition or external AI API connection in this version.</li>
            <li>• No backend, no auth, no cloud storage, and no medical diagnosis.</li>
            <li>• Focus is product UX, report structure, and prioritization clarity.</li>
          </ul>
        </Panel>

        <Link
          href="/upload"
          className="mt-8 inline-flex items-center gap-2 rounded-xl border border-cyan-300/60 bg-cyan-500/20 px-5 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-500/30"
        >
          Start Analysis Flow
          <ArrowRight className="h-4 w-4" />
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

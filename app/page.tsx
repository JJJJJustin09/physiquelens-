import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Compass,
  Gauge,
  Layers3,
  LayoutDashboard,
  LineChart,
  ScanLine,
  Shield,
  Sparkles,
  Target,
  Waves,
} from "lucide-react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SectionTitle } from "@/components/layout/ui";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureCard } from "@/components/landing/feature-card";
import { StepCard } from "@/components/landing/step-card";

const reportFeatures = [
  { icon: <Gauge className="h-4 w-4" />, title: "Overall development score", description: "Snapshot of current physique development with a clear score baseline." },
  { icon: <BarChart3 className="h-4 w-4" />, title: "Muscle group ratings", description: "Back, shoulders, chest, arms, legs, definition, and symmetry impressions." },
  { icon: <Compass className="h-4 w-4" />, title: "V-taper analysis", description: "Assessment of shoulder-to-waist contrast and upper-body shape direction." },
  { icon: <Waves className="h-4 w-4" />, title: "Shoulder width impression", description: "How lateral deltoid development affects overall upper-body width perception." },
  { icon: <ScanLine className="h-4 w-4" />, title: "Arm-to-torso balance", description: "Whether arm fullness visually matches torso development." },
  { icon: <Layers3 className="h-4 w-4" />, title: "Symmetry notes", description: "Current left-right balance impression and where to keep monitoring." },
  { icon: <Target className="h-4 w-4" />, title: "Weak point diagnosis", description: "Most influential limiting factors in your visual physique profile." },
  { icon: <LayoutDashboard className="h-4 w-4" />, title: "Training priority ratio", description: "How to distribute weekly emphasis across key body areas." },
  { icon: <LineChart className="h-4 w-4" />, title: "8–12 week direction", description: "Strategic emphasis plan without overcomplicated daily programming." },
  { icon: <Shield className="h-4 w-4" />, title: "Confidence notes", description: "How photo quality and context influence report confidence level." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#05070A]">
      <SiteNav />
      <main>
        <HeroSection />

        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <SectionTitle>Most people train hard, but not strategically.</SectionTitle>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-300">
              <p className="leading-7">
                Generic workout plans do not account for your individual proportions. Many users
                are unsure whether to prioritize back, shoulders, arms, chest, or legs.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-300">
              <p className="leading-7">
                Visual physique is about balance, proportions, symmetry, and targeted development.
                A physique audit helps you understand what to improve before choosing a training plan.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <SectionTitle>How it works</SectionTitle>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <StepCard
              step="Step 1"
              title="Upload 3 angles"
              description="Upload front, side, and back physique photos using local browser preview only."
            />
            <StepCard
              step="Step 2"
              title="Answer a short questionnaire"
              description="Provide your goal, experience level, frequency, equipment access, and focus area."
            />
            <StepCard
              step="Step 3"
              title="Receive report & priorities"
              description="Get a professional-style report with scores, diagnosis, and training emphasis ratio."
            />
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <SectionTitle>Report includes</SectionTitle>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reportFeatures.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-cyan-400/35 bg-cyan-500/10 p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 text-cyan-200" />
              <div className="text-sm leading-7 text-cyan-50">
                <p>
                This MVP uses simulated AI-style analysis for demonstration. Future versions can
                connect to real computer vision analysis. The report is not medical advice and does
                not diagnose health conditions.
                </p>
                <p className="mt-2 text-cyan-100/90">
                  Global access model: first report is free, then USD 5 internationally or CNY 10 in
                  Mainland China.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-[#111827] to-slate-900/90 p-8 text-center sm:p-12">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">PhysiqueLens</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Start with clarity.
            </h2>
            <Link
              href="/upload"
              className="btn-primary mx-auto mt-6"
            >
              Generate My Report
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

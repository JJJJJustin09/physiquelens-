"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { InlineToast } from "@/components/layout/inline-toast";
import { Panel } from "@/components/layout/ui";
import { getQuestionnaireAnswers, recordPayment, setPendingAccess } from "@/lib/storage";

type PriceOption = "CNY 10" | "USD 5";

export default function CheckoutPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<PriceOption>("CNY 10");
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const answers = getQuestionnaireAnswers();
    if (!answers) {
      router.replace("/questionnaire");
      return;
    }
    const timer = window.setTimeout(() => setReady(true), 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase();
    const preferCny = locale.includes("zh-cn") || timeZone.includes("shanghai");
    const timer = window.setTimeout(() => {
      setSelected(preferCny ? "CNY 10" : "USD 5");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handlePay = () => {
    setPaying(true);

    window.setTimeout(() => {
      recordPayment(selected);
      setPendingAccess("paid");
      setToast("Payment successful. Starting analysis...");
      window.setTimeout(() => {
        router.push("/processing");
      }, 500);
    }, 1400);
  };

  if (!ready) {
    return <div className="min-h-screen bg-[#05070A]" />;
  }

  return (
    <div className="min-h-screen bg-[#05070A]">
      <SiteNav ctaHref="/sample-report" ctaLabel="View Sample Report" />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Unlock Next Report</h1>
        <p className="mt-2 text-slate-300">
          Your first report is free. Starting from your second report, each new analysis requires
          one payment.
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Global pricing: pay with USD 5 (international) or CNY 10 (Mainland China option).
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Panel className="p-5 sm:p-6">
            <div className="mb-4 inline-flex rounded-xl border border-cyan-400/40 bg-cyan-500/15 p-2 text-cyan-200">
              <CreditCard className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-white">Choose your price</h2>
            <p className="mt-2 text-sm text-slate-400">
              This is an MVP payment gate. In this version, payment confirmation is simulated
              locally.
            </p>

            <div className="mt-5 space-y-3">
              {(["CNY 10", "USD 5"] as PriceOption[]).map((option) => (
                <button
                  key={option}
                  onClick={() => setSelected(option)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                    selected === option
                      ? "border-cyan-300/70 bg-cyan-500/20 text-cyan-50"
                      : "border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
                  }`}
                >
                  <span>{option}</span>
                  <span>{selected === option ? "Selected" : "Choose"}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handlePay}
              disabled={paying}
              className="btn-primary mt-5 w-full"
            >
              {paying ? "Processing payment..." : `Pay ${selected} and continue`}
            </button>

            <p className="mt-3 rounded-lg border border-amber-400/35 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
              Simulated payment notice: this MVP does not process real charges yet. No card or
              wallet will be charged in this version.
            </p>
            <p className="mt-2 text-xs text-amber-200/90">
              For live payments, connect Stripe (USD) and a CNY-capable provider (for example
              WeChat Pay/Alipay through a supported PSP) with server-side webhook verification.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Suggested launch setup: card payments globally, local wallets for China.
            </p>
          </Panel>

          <Panel className="p-5 sm:p-6">
            <div className="mb-3 inline-flex rounded-xl border border-violet-400/40 bg-violet-500/15 p-2 text-violet-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">What you get</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• New simulated physique report based on your latest questionnaire.</li>
              <li>• Updated priority ratio and diagnosis blocks.</li>
              <li>• 8–12 week training emphasis refresh.</li>
            </ul>

            <div className="mt-5 rounded-xl border border-emerald-400/35 bg-emerald-500/12 p-4 text-sm text-emerald-100">
              <p className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                Supportive, non-medical, simulated analysis only. No body-shaming language.
              </p>
            </div>

            <Link
              href="/questionnaire"
              className="mt-5 inline-flex text-sm text-slate-400 underline decoration-slate-600 underline-offset-4 transition hover:text-slate-200"
            >
              Back to questionnaire
            </Link>
          </Panel>
        </div>
      </main>
      <SiteFooter />
      {toast ? <InlineToast message={toast} variant="success" onClose={() => setToast(null)} /> : null}
    </div>
  );
}

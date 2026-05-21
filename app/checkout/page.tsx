"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { InlineToast } from "@/components/layout/inline-toast";
import { Panel } from "@/components/layout/ui";
import { createCheckoutSession, verifyCheckoutSession } from "@/lib/api-client";
import { getFlowSubmission, setFlowSubmission } from "@/lib/flow-storage";
import { getQuestionnaireAnswers } from "@/lib/storage";

type PriceOption = "CNY 10" | "USD 5";

export default function CheckoutPage() {
  const router = useRouter();
  const [query, setQuery] = useState<{
    status: string | null;
    sessionId: string | null;
    submissionId: string | null;
  }>({
    status: null,
    sessionId: null,
    submissionId: null,
  });
  const [selected, setSelected] = useState<PriceOption>("CNY 10");
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const flowSubmissionId = query.submissionId ?? getFlowSubmission()?.submissionId ?? null;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const timer = window.setTimeout(() => {
      setQuery({
        status: params.get("status"),
        sessionId: params.get("session_id"),
        submissionId: params.get("submission_id"),
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const answers = getQuestionnaireAnswers();
    const status = query.status;
    const hasCheckoutReturn = status === "success" || status === "cancel";
    if (!answers && !hasCheckoutReturn) {
      router.replace("/questionnaire");
      return;
    }
    if (!flowSubmissionId && !hasCheckoutReturn) {
      router.replace("/questionnaire");
      return;
    }

    const checkoutSessionId = query.sessionId;
    if (status === "success" && checkoutSessionId) {
      const verifyTimer = window.setTimeout(() => {
        setPaying(true);
        void (async () => {
          try {
            const verification = await verifyCheckoutSession(checkoutSessionId);
            if (verification.status === "succeeded") {
              const submissionIdForFlow = flowSubmissionId ?? query.submissionId;
              if (submissionIdForFlow) {
                setFlowSubmission(submissionIdForFlow);
              }
              setToast("Payment confirmed. Continuing to report generation...");
              router.replace("/processing");
              return;
            }
            if (verification.status === "pending") {
              setError("Payment is still processing. Please wait a few seconds and refresh.");
            } else {
              setError("Payment was not completed. Please try again.");
            }
          } catch (verifyError) {
            const message =
              verifyError instanceof Error
                ? verifyError.message
                : "Unable to verify payment status.";
            setError(message);
          } finally {
            setPaying(false);
          }
        })();
      }, 0);
      const readyTimer = window.setTimeout(() => setReady(true), 0);
      return () => {
        window.clearTimeout(verifyTimer);
        window.clearTimeout(readyTimer);
      };
    } else if (status === "cancel") {
      const cancelTimer = window.setTimeout(() => {
        setError("Checkout canceled. You can retry payment to unlock this report.");
      }, 0);
      const readyTimer = window.setTimeout(() => setReady(true), 0);
      return () => {
        window.clearTimeout(cancelTimer);
        window.clearTimeout(readyTimer);
      };
    }

    const timer = window.setTimeout(() => setReady(true), 0);
    return () => window.clearTimeout(timer);
  }, [flowSubmissionId, query.sessionId, query.status, query.submissionId, router]);

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
    if (!flowSubmissionId) {
      setError("Missing submission context. Please re-submit the questionnaire.");
      return;
    }
    setPaying(true);
    setError(null);

    void (async () => {
      try {
        const checkoutUrl = await createCheckoutSession({
          priceOption: selected === "USD 5" ? "USD_5" : "CNY_10",
          submissionId: flowSubmissionId,
        });
        window.location.href = checkoutUrl;
      } catch (checkoutError) {
        const message =
          checkoutError instanceof Error
            ? checkoutError.message
            : "Unable to start checkout.";
        setError(message);
        setPaying(false);
      }
    })();
  };

  if (!ready) {
    return <div className="min-h-screen bg-[#05070A]" />;
  }

  return (
    <div className="min-h-screen bg-[#05070A]">
      <SiteNav ctaHref="/sample-report" ctaLabel="View Sample Report" />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Unlock Report Access</h1>
        <p className="mt-2 text-slate-300">
          Every report requires one paid credit. Complete payment to generate this report.
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
              Commercial flow is now connected to Stripe Checkout. Payment must be confirmed
              before the next report is generated.
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
              Test-mode note: when Stripe keys are test keys, no real card charge occurs.
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

            {error ? (
              <p className="mt-4 rounded-lg border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                {error}
              </p>
            ) : null}
          </Panel>
        </div>
      </main>
      <SiteFooter />
      {toast ? <InlineToast message={toast} variant="success" onClose={() => setToast(null)} /> : null}
    </div>
  );
}

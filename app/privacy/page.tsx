import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SectionTitle } from "@/components/layout/ui";
import { PrivacyPanel } from "@/components/report/privacy-panel";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#05070A]">
      <SiteNav ctaHref="/upload" ctaLabel="Generate Report" />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionTitle>Privacy & Disclaimer</SectionTitle>
        <p className="mt-3 text-slate-300">
          PhysiqueLens MVP is designed to be supportive, professional, and transparent about what the
          demo does and does not do.
        </p>

        <div className="mt-6 space-y-4">
          <PrivacyPanel
            title="1. Data handling in MVP"
            text="In this production-oriented MVP, uploaded photo metadata and questionnaire answers are stored with your account to generate and preserve report history. Raw photo files are not analyzed by real AI in this version."
          />
          <PrivacyPanel
            title="2. No medical advice"
            text="PhysiqueLens is a visual physique report tool. It is not medical advice and does not diagnose health conditions."
          />
          <PrivacyPanel
            title="3. Account data and retention"
            text="Account records, submissions, payment references, and generated reports are stored to operate the commercial service. Future account settings will include user-managed deletion workflows."
          />
          <PrivacyPanel
            title="4. Limitations"
            text="Photo angle, lighting, clothing, and pose can affect visual impressions and scores."
          />
          <PrivacyPanel
            title="5. Supportive design"
            text="Our goal is to help users understand improvement priorities without shame, judgment, or unrealistic promises."
          />
          <PrivacyPanel
            title="6. Payments and processors"
            text="Payments are handled by Stripe Checkout. PhysiqueLens does not directly store full card details. We store transaction references, amount, currency, and status for credits and auditability."
          />
          <PrivacyPanel
            title="7. Authentication and access control"
            text="Protected pages require sign-in. Submission creation, report generation, and payment verification are authorized server-side to prevent unauthorized access."
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

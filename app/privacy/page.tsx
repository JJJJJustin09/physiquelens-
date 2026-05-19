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
            text="In this MVP, uploaded photos are used only for local preview in your browser and are not sent to a server."
          />
          <PrivacyPanel
            title="2. No medical advice"
            text="PhysiqueLens is a visual physique report tool. It is not medical advice and does not diagnose health conditions."
          />
          <PrivacyPanel
            title="3. No permanent storage"
            text="This MVP does not permanently store uploaded photos. Future versions should include clear user consent, deletion controls, and secure storage if cloud analysis is added."
          />
          <PrivacyPanel
            title="4. Limitations"
            text="Photo angle, lighting, clothing, and pose can affect visual impressions and scores."
          />
          <PrivacyPanel
            title="5. Supportive design"
            text="Our goal is to help users understand improvement priorities without shame, judgment, or unrealistic promises."
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

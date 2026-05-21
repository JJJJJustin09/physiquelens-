"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { UploadCard } from "@/components/upload/upload-card";
import { PhotoChecklist } from "@/components/upload/photo-checklist";
import { InlineToast } from "@/components/layout/inline-toast";
import { fetchBillingStatus } from "@/lib/api-client";
import { savePhotoMeta } from "@/lib/storage";

type PhotoSlot = {
  previewUrl?: string;
  fileName?: string;
};

type PhotoState = {
  front: PhotoSlot;
  side: PhotoSlot;
  back: PhotoSlot;
};

const emptyState: PhotoState = {
  front: {},
  side: {},
  back: {},
};

export default function UploadPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<PhotoState>(emptyState);
  const [toast, setToast] = useState<{ message: string; variant: "info" | "success" } | null>(null);
  const [pricingHint, setPricingHint] = useState("Each report requires one paid credit (USD $5).");
  const objectUrlsRef = useRef<string[]>([]);

  const allSelected = useMemo(
    () => Boolean(photos.front.previewUrl && photos.side.previewUrl && photos.back.previewUrl),
    [photos],
  );

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        const billing = await fetchBillingStatus();
        if (billing.paidCredits > 0) {
          setPricingHint(
            `You have ${billing.paidCredits} paid credit${billing.paidCredits > 1 ? "s" : ""} available for report generation.`,
          );
        } else {
          setPricingHint("No paid credits available. Complete checkout to generate a report (USD $5).");
        }
      } catch {
        setPricingHint("Unable to load billing status. You can still continue and verify at checkout.");
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (allSelected) {
      const timer = window.setTimeout(() => {
        setToast({ message: "Photos selected", variant: "success" });
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [allSelected]);

  const updateSlot = (slotKey: keyof PhotoState, file: File) => {
    setPhotos((prev) => {
      const prevUrl = prev[slotKey].previewUrl;
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
        objectUrlsRef.current = objectUrlsRef.current.filter((url) => url !== prevUrl);
      }
      const nextUrl = URL.createObjectURL(file);
      objectUrlsRef.current.push(nextUrl);

      return {
        ...prev,
        [slotKey]: {
          previewUrl: nextUrl,
          fileName: file.name,
        },
      };
    });
  };

  const removeSlot = (slotKey: keyof PhotoState) => {
    setPhotos((prev) => {
      const prevUrl = prev[slotKey].previewUrl;
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
        objectUrlsRef.current = objectUrlsRef.current.filter((url) => url !== prevUrl);
      }

      return {
        ...prev,
        [slotKey]: {},
      };
    });
  };

  const handleContinue = () => {
    if (!allSelected) {
      setToast({ message: "Upload all three angles to continue.", variant: "info" });
      return;
    }

    savePhotoMeta({
      frontSelected: true,
      sideSelected: true,
      backSelected: true,
      frontFileName: photos.front.fileName,
      sideFileName: photos.side.fileName,
      backFileName: photos.back.fileName,
      updatedAt: new Date().toISOString(),
    });

    router.push("/questionnaire");
  };

  return (
    <div className="min-h-screen bg-[#05070A]">
      <SiteNav ctaHref="/sample-report" ctaLabel="View Sample Report" />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-white">Upload Photos</h1>
          <p className="mt-2 text-slate-300">
            Upload front, side, and back photos for your simulated AI-style physique report.
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {pricingHint}
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.5fr,1fr]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
            <UploadCard
              id="frontPhoto"
              label="Front photo"
              description="Neutral front stance, full body visible"
              previewUrl={photos.front.previewUrl}
              fileName={photos.front.fileName}
              onFileSelected={(file) => updateSlot("front", file)}
              onRemove={() => removeSlot("front")}
            />
            <UploadCard
              id="sidePhoto"
              label="Side photo"
              description="Natural side profile, relaxed posture"
              previewUrl={photos.side.previewUrl}
              fileName={photos.side.fileName}
              onFileSelected={(file) => updateSlot("side", file)}
              onRemove={() => removeSlot("side")}
            />
            <div className="md:col-span-2 xl:col-span-2">
              <UploadCard
                id="backPhoto"
                label="Back photo"
                description="Back view with shoulders and legs visible"
                previewUrl={photos.back.previewUrl}
                fileName={photos.back.fileName}
                onFileSelected={(file) => updateSlot("back", file)}
                onRemove={() => removeSlot("back")}
              />
            </div>
          </div>

          <div className="space-y-4">
            <PhotoChecklist />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            {allSelected ? "All required angles selected." : "Upload all three angles to continue."}
          </p>
          <button
            onClick={handleContinue}
            disabled={!allSelected}
            className="btn-primary disabled:opacity-40"
          >
            Continue to Questionnaire
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
      <SiteFooter />
      {toast ? <InlineToast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} /> : null}
    </div>
  );
}

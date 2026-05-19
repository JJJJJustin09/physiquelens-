"use client";

import { useEffect } from "react";
import { CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type InlineToastProps = {
  message: string;
  variant?: "info" | "success";
  onClose?: () => void;
};

export function InlineToast({ message, variant = "info", onClose }: InlineToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onClose?.();
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed right-4 top-20 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-xl",
        variant === "success"
          ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-100"
          : "border-cyan-400/40 bg-cyan-500/15 text-cyan-100",
      )}
    >
      {variant === "success" ? <CheckCircle2 className="h-4 w-4" /> : <Info className="h-4 w-4" />}
      <span>{message}</span>
    </div>
  );
}

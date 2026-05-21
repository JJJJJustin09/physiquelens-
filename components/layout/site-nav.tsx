"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActivitySquare, ArrowRight } from "lucide-react";
import { AccountNav } from "@/components/layout/account-nav";

type SiteNavProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

const navLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/sample-report", label: "Sample Report" },
  { href: "/account", label: "Account" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteNav({
  ctaHref = "/upload",
  ctaLabel = "Generate Report",
}: SiteNavProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06080f]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-400/50 bg-cyan-500/20 text-cyan-300">
            <ActivitySquare className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">PhysiqueLens</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  active ? "text-cyan-300" : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/50 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-500/25"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <AccountNav />
        </div>
      </div>
      <nav className="flex items-center gap-5 overflow-x-auto border-t border-white/10 px-4 py-2 text-xs md:hidden">
        {navLinks.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={`mobile-${link.href}`}
              href={link.href}
              className={`whitespace-nowrap transition-colors ${
                active ? "text-cyan-300" : "text-slate-300 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

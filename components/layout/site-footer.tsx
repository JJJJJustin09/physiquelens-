import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#06080f]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} PhysiqueLens MVP.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="transition hover:text-white">
            Privacy
          </Link>
          <Link href="/how-it-works" className="transition hover:text-white">
            How it works
          </Link>
          <Link href="/sample-report" className="transition hover:text-white">
            Sample report
          </Link>
        </div>
      </div>
    </footer>
  );
}

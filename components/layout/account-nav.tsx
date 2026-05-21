"use client";

import { signOut, useSession } from "next-auth/react";

export function AccountNav() {
  const { data } = useSession();

  if (!data?.user) return null;

  return (
    <div className="ml-3 flex items-center gap-2">
      <span className="hidden text-xs text-slate-400 sm:inline">
        {data.user.email}
      </span>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/10"
      >
        Sign out
      </button>
    </div>
  );
}

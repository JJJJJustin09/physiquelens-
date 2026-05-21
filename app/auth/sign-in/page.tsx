"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Panel } from "@/components/layout/ui";

export default function SignInPage() {
  const router = useRouter();
  const { status } = useSession();
  const [callbackUrl, setCallbackUrl] = useState("/upload");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const callback = params.get("callbackUrl");
    const timer = window.setTimeout(() => {
      if (callback) {
        setCallbackUrl(callback);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [callbackUrl, router, status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push(result?.url ?? callbackUrl);
  };

  const signUpHref = `/auth/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <div className="min-h-screen bg-[#05070A]">
      <SiteNav ctaHref={signUpHref} ctaLabel="Create Account" />
      <main className="mx-auto flex w-full max-w-md px-4 py-14 sm:px-6 lg:px-8">
        <Panel className="w-full p-6 sm:p-7">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Sign in</h1>
          <p className="mt-2 text-sm text-slate-400">
            Access your submissions, reports, and paid credits.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-slate-100 outline-none ring-cyan-400/50 transition focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-slate-100 outline-none ring-cyan-400/50 transition focus:ring-2"
              />
            </div>

            {error ? (
              <p className="rounded-lg border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                {error}
              </p>
            ) : null}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-400">
            New to PhysiqueLens?{" "}
            <Link href={signUpHref} className="text-cyan-300 hover:text-cyan-200">
              Create account
            </Link>
          </p>
        </Panel>
      </main>
      <SiteFooter />
    </div>
  );
}

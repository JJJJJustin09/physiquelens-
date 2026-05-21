"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Panel } from "@/components/layout/ui";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error ?? "Unable to create account.");
      setSubmitting(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/upload",
    });

    if (signInResult?.error) {
      setError("Account created, but sign-in failed. Please sign in manually.");
      setSubmitting(false);
      return;
    }

    router.push("/upload");
  };

  return (
    <div className="min-h-screen bg-[#05070A]">
      <SiteNav ctaHref="/auth/sign-in" ctaLabel="Sign In" />
      <main className="mx-auto flex w-full max-w-md px-4 py-14 sm:px-6 lg:px-8">
        <Panel className="w-full p-6 sm:p-7">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Create account</h1>
          <p className="mt-2 text-sm text-slate-400">
            Save reports, manage payment credits, and unlock secure commercial flows.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm text-slate-300">Name</label>
              <input
                type="text"
                required
                minLength={1}
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-slate-100 outline-none ring-cyan-400/50 transition focus:ring-2"
              />
            </div>
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
                maxLength={128}
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

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-4 text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-cyan-300 hover:text-cyan-200">
              Sign in
            </Link>
          </p>
        </Panel>
      </main>
      <SiteFooter />
    </div>
  );
}

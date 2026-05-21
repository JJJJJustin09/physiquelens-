import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { Panel } from "@/components/layout/ui";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/sign-in?callbackUrl=/account");
  }

  const [user, latestReports] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        paidCredits: true,
        reportsGenerated: true,
        payments: {
          where: { status: "SUCCEEDED" },
          orderBy: { createdAt: "desc" },
          select: { amount: true, currency: true, createdAt: true },
          take: 5,
        },
      },
    }),
    prisma.reportRecord.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, createdAt: true, overallScore: true, submissionId: true },
    }),
  ]);

  if (!user) {
    redirect("/auth/sign-in?callbackUrl=/account");
  }

  return (
    <div className="min-h-screen bg-[#05070A]">
      <SiteNav ctaHref="/upload" ctaLabel="New Analysis" />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Account</h1>
        <p className="mt-2 text-slate-300">
          Commercial MVP account dashboard for usage and payment visibility.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Panel className="p-5">
            <p className="text-xs text-slate-400">Name</p>
            <p className="mt-1 text-lg font-semibold text-white">{user.name ?? "—"}</p>
          </Panel>
          <Panel className="p-5">
            <p className="text-xs text-slate-400">Email</p>
            <p className="mt-1 text-sm font-medium text-white">{user.email}</p>
          </Panel>
          <Panel className="p-5">
            <p className="text-xs text-slate-400">Reports generated</p>
            <p className="mt-1 text-2xl font-semibold text-cyan-100">{user.reportsGenerated}</p>
          </Panel>
          <Panel className="p-5">
            <p className="text-xs text-slate-400">Paid credits</p>
            <p className="mt-1 text-2xl font-semibold text-emerald-100">{user.paidCredits}</p>
          </Panel>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Panel className="p-5">
            <h2 className="text-lg font-semibold text-white">Recent payments</h2>
            <div className="mt-4 space-y-3">
              {user.payments.length === 0 ? (
                <p className="text-sm text-slate-400">No successful payments yet.</p>
              ) : (
                user.payments.map((payment) => (
                  <div
                    key={`${payment.createdAt.toISOString()}-${payment.amount}`}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300"
                  >
                    <p className="font-medium text-white">
                      {(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(payment.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Panel>

          <Panel className="p-5">
            <h2 className="text-lg font-semibold text-white">Recent reports</h2>
            <div className="mt-4 space-y-3">
              {latestReports.length === 0 ? (
                <p className="text-sm text-slate-400">No reports generated yet.</p>
              ) : (
                latestReports.map((report) => (
                  <div
                    key={report.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300"
                  >
                    <p className="font-medium text-white">
                      Overall score {report.overallScore}/100
                    </p>
                    <p className="text-xs text-slate-400">
                      Submission {report.submissionId.slice(0, 8)} ·{" "}
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

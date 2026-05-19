import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://physiquelens.app"),
  title: {
    default: "PhysiqueLens | Know What to Improve Before You Train",
    template: "%s | PhysiqueLens",
  },
  description:
    "Upload front, side, and back photos and get a professional-style physique report with development scores, visual balance insights, and improvement priorities.",
  keywords: [
    "physique analysis",
    "fitness report",
    "body proportions",
    "aesthetic training",
    "v-taper",
    "physique audit",
  ],
  openGraph: {
    title: "PhysiqueLens",
    description:
      "Know what to improve before you train. Simulated AI-style physique assessment for MVP demo.",
    url: "https://physiquelens.app",
    siteName: "PhysiqueLens",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PhysiqueLens",
    description:
      "Know what to improve before you train. Simulated AI-style physique assessment for MVP demo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#05070A] text-slate-100">{children}</body>
    </html>
  );
}

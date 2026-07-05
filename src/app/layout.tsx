import type { Metadata } from "next";
import { Inter, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Viyaan AI — Intelligence Beyond the Human Mind",
  description: "Official digital headquarters of Viyaan AI, an Artificial Intelligence product and research company combining AI, psychology, product design, and automation to amplify human potential.",
  keywords: ["Viyaan AI", "JOI Companion", "Human OS", "AI Research", "Dharani Kumar", "Artificial Intelligence", "Cognitive Psychology", "Human-centered AI"],
  authors: [{ name: "Dharani Kumar" }],
  openGraph: {
    title: "Viyaan AI — Intelligence Beyond the Human Mind",
    description: "Official digital headquarters of Viyaan AI, a next-generation AI product and research company.",
    type: "website",
    url: "https://viyaan.ai",
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Viyaan AI — Intelligence Beyond the Human Mind",
    description: "An AI product and research company building JOI Companion, Human OS, and Viyaan Future.",
    images: ["/logo.png"],
  }
};

import { getDb } from "@/lib/db";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import WebVitalsTracker from "@/components/WebVitalsTracker";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
  let cookieConsentEnabled = true;

  try {
    const db = await getDb();
    const analytics = db.analytics || {};
    if (!gaMeasurementId && analytics.gaTrackingId) {
      gaMeasurementId = analytics.gaTrackingId;
    }
    if (analytics.cookieConsentEnabled !== undefined) {
      cookieConsentEnabled = analytics.cookieConsentEnabled;
    }
  } catch (e) {
    console.error("Error loading layout analytics config:", e);
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${playfair.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full bg-[#050505] text-zinc-100 flex flex-col font-sans">
        <GoogleAnalytics measurementId={gaMeasurementId} cookieConsentEnabled={cookieConsentEnabled} />
        <WebVitalsTracker />
        {children}
      </body>
    </html>
  );
}

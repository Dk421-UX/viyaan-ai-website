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

import { getDb } from "@/lib/db";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import WebVitalsTracker from "@/components/WebVitalsTracker";

const defaultWebsiteUrl = "https://viyaan-ai-website.onrender.com";

function websiteUrl(value: unknown) {
  if (typeof value !== "string") return defaultWebsiteUrl;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString().replace(/\/$/, "") : defaultWebsiteUrl;
  } catch {
    return defaultWebsiteUrl;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  let url = defaultWebsiteUrl;
  try {
    const db = await getDb();
    url = websiteUrl(db.companyInfo?.websiteUrl);
  } catch {}

  return {
    metadataBase: new URL(url),
    title: "Viyaan AI | AI That Helps People Learn Better",
    description: "Building intelligent learning solutions through AI, data science, and purposeful innovation.",
    alternates: { canonical: url },
    openGraph: { title: "Viyaan AI | AI That Helps People Learn Better", description: "Building intelligent learning solutions through AI, data science, and purposeful innovation.", type: "website", url, images: [{ url: "/logo.png" }] },
    twitter: { card: "summary_large_image", title: "Viyaan AI | AI That Helps People Learn Better", description: "Beyond Learning. Beyond Limits.", images: ["/logo.png"] },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
  let cookieConsentEnabled = true;
  let canonicalUrl = defaultWebsiteUrl;

  try {
    const db = await getDb();
    const analytics = db.analytics || {};
    canonicalUrl = websiteUrl(db.companyInfo?.websiteUrl);
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
      <body className="min-h-full bg-[#040711] text-zinc-100 flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Viyaan AI",
              "url": canonicalUrl,
              "logo": `${canonicalUrl}/logo.png`,
              "description":
                "Viyaan AI builds AI-powered learning experiences that help people understand concepts, organize their preparation, strengthen knowledge retention, and develop independent problem-solving skills.",
              "slogan": "Beyond Learning. Beyond Limits.",
              "founder": {
                "@type": "Person",
                "name": "Dharani Kumar"
              },
              "sameAs": [
                "https://www.linkedin.com/company/viyaan-ai",
                "https://www.linkedin.com/in/dharani-kumar-49622b349",
                "https://x.com/by_dharani"
              ]
            }),
          }}
        />
        <GoogleAnalytics
          measurementId={gaMeasurementId}
          cookieConsentEnabled={cookieConsentEnabled}
        />
        <WebVitalsTracker />
        {children}
      </body>
    </html>
  );
}

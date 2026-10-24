import { MetadataRoute } from "next";
import { getDb } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let baseUrl = "https://viyaan-ai-website.onrender.com";
  try {
    const db = await getDb();
    if (db?.companyInfo?.websiteUrl) {
      baseUrl = db.companyInfo.websiteUrl.replace(/\/+$/, "");
    }
  } catch {}

  const now = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];
}

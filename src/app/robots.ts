import { MetadataRoute } from "next";
import { getDb } from "@/lib/db";

export default async function robots(): Promise<MetadataRoute.Robots> {
  let baseUrl = "https://viyaan-ai-website.onrender.com";
  try {
    const db = await getDb();
    if (db?.companyInfo?.websiteUrl) {
      baseUrl = db.companyInfo.websiteUrl.replace(/\/+$/, "");
    }
  } catch {}

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

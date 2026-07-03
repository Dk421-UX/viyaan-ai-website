import { getDb } from "@/lib/db";
import ResearchClient from "./ResearchClient";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const db = await getDb();
  const seo = db.seo?.research || {};
  return {
    title: seo.title || "Research — Viyaan AI",
    description: seo.description || "Exploring cognitive architectures, human-computer symbiosis, and private future continuity."
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ResearchPage() {
  const db = await getDb();
  const papers = (db.research || []).filter((r: any) => r.status === "published");

  return <ResearchClient papers={papers} />;
}

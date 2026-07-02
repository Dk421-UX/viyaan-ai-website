import { getDb } from "@/lib/db";
import FounderClient from "./FounderClient";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const db = await getDb();
  const seo = db.seo?.founder || {};
  return {
    title: seo.title || "Founding Architect — Viyaan AI",
    description: seo.description || "Dharani Kumar, founder of Viyaan AI, building systems that extend human capability."
  };
}

export default async function FounderPage() {
  const db = await getDb();
  const company = db.companyInfo || {};

  return <FounderClient company={company} />;
}

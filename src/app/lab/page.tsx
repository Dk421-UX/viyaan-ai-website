import { getDb } from "@/lib/db";
import LabClient from "./LabClient";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const db = await getDb();
  const seo = db.seo?.lab || {};
  return {
    title: seo.title || "Innovation Lab — Viyaan AI",
    description: seo.description || "Experimental tools and utility applications built in public by Viyaan AI."
  };
}

export default async function LabPage() {
  const db = await getDb();
  const projects = (db.labProjects || []).filter((p: any) => p.status === "published");

  return <LabClient projects={projects} />;
}

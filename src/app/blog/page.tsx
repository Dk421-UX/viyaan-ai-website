import { getDb } from "@/lib/db";
import BlogClient from "./BlogClient";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const db = await getDb();
  const seo = db.seo?.blog || {};
  return {
    title: seo.title || "Blog — Viyaan AI",
    description: seo.description || "Latest updates, announcements, and thoughts from Viyaan AI."
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BlogPage() {
  const db = await getDb();
  const posts = (db.posts || []).filter((p: any) => p.status === "published");

  return <BlogClient posts={posts} />;
}

import { getDb } from "@/lib/db";
import SingleBlogClient from "./SingleBlogClient";
import { Metadata } from "next";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const db = await getDb();
  const post = (db.posts || []).find((p: any) => p.slug === params.slug);
  
  if (!post) {
    return {
      title: "Article Not Found — Viyaan AI Blog",
      description: "The requested article could not be located in our ledger."
    };
  }

  return {
    title: post.seoTitle || `${post.title} — Viyaan AI Blog`,
    description: post.seoDesc || post.excerpt || "Read this ledger entry from the Viyaan AI team."
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SingleBlogPage({ params }: PageProps) {
  const db = await getDb();
  const post = (db.posts || []).find((p: any) => p.slug === params.slug);

  return <SingleBlogClient post={post} />;
}

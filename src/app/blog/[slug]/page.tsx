import { getDb } from "@/lib/db";
import SingleBlogClient from "./SingleBlogClient";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const db = await getDb();
  const post = (db.posts || []).find((p: any) => p.slug === params.slug);

  if (!post) {
    return {
      title: "Article Not Found — Viyaan AI",
      description: "The requested article could not be located in our publication index.",
    };
  }

  return {
    title: post.seoTitle || `${post.title} — Viyaan AI`,
    description:
      post.seoDesc || post.excerpt || "Read this publication from the Viyaan AI research team.",
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SingleBlogPage(props: PageProps) {
  const params = await props.params;
  const db = await getDb();
  const post = (db.posts || []).find((p: any) => p.slug === params.slug);

  return <SingleBlogClient post={post} />;
}

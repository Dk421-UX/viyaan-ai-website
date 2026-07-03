import { getDb } from "@/lib/db";
import ProductsClient from "./ProductsClient";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const db = await getDb();
  const seo = db.seo?.products || {};
  return {
    title: seo.title || "Products — Viyaan AI",
    description: seo.description || "Explore the Viyaan AI product ecosystem: JOI Companion AI, Human OS, and Viyaan Future."
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductsPage() {
  console.log("[Products Page Public Fetch] Fetching database content...");
  const db = await getDb();
  const allProducts = db.products || [];
  console.log(`[Products Page Returned Rows] Total products fetched from database: ${allProducts.length}`);
  
  const publishedProducts = allProducts.filter((p: any) => p.status === "published");
  console.log(`[Products Page Filtered Rows] Published products count: ${publishedProducts.length}`);
  console.log(`[Products Page Rendering Count] Rendering ${publishedProducts.length} product cards.`);

  return <ProductsClient products={publishedProducts} />;
}

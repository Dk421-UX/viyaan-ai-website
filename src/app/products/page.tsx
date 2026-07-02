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

export default async function ProductsPage() {
  const db = await getDb();
  const products = (db.products || []).filter((p: any) => p.status === "published");

  return <ProductsClient products={products} />;
}

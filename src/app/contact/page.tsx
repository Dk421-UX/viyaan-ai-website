import { getDb } from "@/lib/db";
import ContactClient from "./ContactClient";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const db = await getDb();
  const seo = db.seo?.contact || {};
  return {
    title: seo.title || "Contact — Viyaan AI",
    description: seo.description || "Connect with the Viyaan AI team for inquiries, collaborations, and career opportunities."
  };
}

export default async function ContactPage() {
  const db = await getDb();
  const company = db.companyInfo || {};

  return <ContactClient company={company} />;
}

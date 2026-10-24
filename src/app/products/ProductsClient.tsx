import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import PageIntro from "@/components/PageIntro";
import ProjectGrid from "@/components/ProjectGrid";
import SiteContainer from "@/components/SiteContainer";

export default function ProductsClient({ products }: { products: any[] }) {
  return (
    <div className="site-page">
      <Navigation />
      <main className="page-header-offset flex-1">
        <SiteContainer>
          <PageIntro
            eyebrow="Projects"
            title="Learning tools with a clear purpose."
            description="Focused initiatives for revision, preparation, and academic planning."
            className="mb-10 sm:mb-12"
          />
          <ProjectGrid projects={products} />
        </SiteContainer>
      </main>
      <Footer />
    </div>
  );
}

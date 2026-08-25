import type { Metadata } from "next";
import Image from "next/image";
import { ChevronsDown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WorksGallery } from "@/components/works-gallery";
import { IMG } from "@/lib/images";
import { PAGE_SEO, breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/seo";

export const metadata: Metadata = {
  title: PAGE_SEO.works.title,
  description: PAGE_SEO.works.description,
  alternates: { canonical: PAGE_SEO.works.path },
  openGraph: {
    title: PAGE_SEO.works.title,
    description: PAGE_SEO.works.description,
    url: PAGE_SEO.works.path,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_SEO.works.title,
    description: PAGE_SEO.works.description,
  },
};
export const dynamic = "force-dynamic";

export default async function WorksPage() {
  const rows = await prisma.work.findMany({
    orderBy: [{ order: "asc" }],
  });
  const works = rows.map((w) => ({
    id: w.id,
    title: w.title,
    imageUrl: w.imageUrl,
    width: w.width,
    height: w.height,
  }));

  return (
    <main className="relative">
      <script
        {...jsonLdScriptProps(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Works", path: "/works" },
          ])
        )}
      />
      <Header />

      <section className="relative isolate h-[40svh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <Image
          src={IMG.worksHero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />

        <div className="relative z-10 text-center px-6 pt-12">
          <h1 className="font-display text-5xl sm:text-6xl md:text-[5rem] leading-none tracking-tight text-bone">
            .works
          </h1>
          <a
            href="#grid"
            aria-label="Scroll to gallery"
            className="mt-6 inline-flex justify-center text-bone/80 hover:text-gold transition-colors"
          >
            <ChevronsDown size={42} strokeWidth={1.2} className="animate-floaty" />
          </a>
        </div>
      </section>

      <section id="grid" className="relative pt-8 md:pt-10 pb-10 md:pb-14 border-t border-ink-line">
        <div className="mx-auto max-w-[1500px] px-6 md:px-10">
          <p className="font-display text-xl md:text-2xl lg:text-3xl leading-snug text-balance text-bone/90 max-w-5xl mx-auto text-center">
            Every line, every detail tells your unique story. Explore my extraordinary designs
            and let them bring significance to your life.
          </p>
        </div>
      </section>

      <section className="relative pb-32">
        <div className="mx-auto max-w-[1500px] px-6 md:px-10">
          <WorksGallery works={works} />
        </div>
      </section>

      <Footer />
    </main>
  );
}

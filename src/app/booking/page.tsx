import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import { ChevronsDown } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { IMG } from "@/lib/images";
import { PAGE_SEO, breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/seo";

export const metadata: Metadata = {
  title: PAGE_SEO.booking.title,
  description: PAGE_SEO.booking.description,
  alternates: { canonical: PAGE_SEO.booking.path },
  openGraph: {
    title: PAGE_SEO.booking.title,
    description: PAGE_SEO.booking.description,
    url: PAGE_SEO.booking.path,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_SEO.booking.title,
    description: PAGE_SEO.booking.description,
  },
};

export default function BookingPage() {
  return (
    <main className="relative">
      <script
        {...jsonLdScriptProps(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Booking", path: "/booking" },
          ])
        )}
      />
      <Header />

      <section className="relative isolate h-[40svh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <Image
          src={IMG.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />

        <div className="relative z-10 text-center px-6 pt-12">
          <h1 className="font-display text-5xl sm:text-6xl md:text-[5rem] leading-none tracking-tight text-bone">
            .booking
          </h1>
          <a
            href="#form"
            aria-label="Scroll to booking form"
            className="mt-6 inline-flex justify-center text-bone/80 hover:text-gold transition-colors"
          >
            <ChevronsDown size={42} strokeWidth={1.2} className="animate-floaty" />
          </a>
        </div>
      </section>

      <section id="form" className="bg-bone text-ink py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          <p className="text-center text-lg md:text-xl leading-relaxed">
            Hello, thank you for your interest in getting a tattoo with me. I kindly
            request you to fill out this form to provide me with more ideas about the
            design. It will be a pleasure to collaborate and create a beautiful and
            unique project together. By filling out the form, I will have a better
            understanding of your preferences and be able to create a tattoo design
            that truly reflects your vision. I am excited to assist you and look
            forward to working on this project together. Thank you.
          </p>

          <div className="mt-14">
            <div
              className="elfsight-app-0c7a31b6-d215-4e86-ab96-1f27573fe7c7"
              data-elfsight-app-lazy
            />
          </div>
        </div>
      </section>

      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="afterInteractive"
      />

      <Footer />
    </main>
  );
}

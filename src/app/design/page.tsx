import Link from "next/link";
import Image from "next/image";
import { ChevronsDown, Settings } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DesignLedger } from "@/components/design-ledger";
import { IMG } from "@/lib/images";

export const metadata = { title: ".design — fi.artistry" };

export default function DesignPage() {
  return (
    <main className="relative">
      <Header />

      {/* Hero: full-bleed bg with centered category title + chevron */}
      <section className="relative isolate h-[40svh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <Image
          src={IMG.designHero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />

        <div className="relative z-10 text-center px-6">
          <h1 className="font-display text-5xl sm:text-6xl md:text-[5rem] leading-none tracking-tight text-bone">
            .design
          </h1>
          <a
            href="#ledger"
            aria-label="Scroll to ledger"
            className="mt-6 inline-flex justify-center text-bone/80 hover:text-gold transition-colors"
          >
            <ChevronsDown size={42} strokeWidth={1.2} className="animate-floaty" />
          </a>
        </div>
      </section>

      {/* Tagline */}
      <section id="ledger" className="relative pt-8 md:pt-10 pb-10 md:pb-14 border-t border-ink-line">
        <div className="mx-auto max-w-[1500px] px-6 md:px-10">
          <p className="font-display text-xl md:text-2xl lg:text-3xl leading-snug text-balance text-bone/90 max-w-5xl mx-auto text-center">
            Ready-made pieces, each drawn from scratch and inked only once. Available designs
            are waiting; sold ones have found their person.
          </p>
        </div>
      </section>

      {/* Ledger grid */}
      <section className="relative pb-32">
        <div className="mx-auto max-w-[1500px] px-6 md:px-10">
          <div className="flex items-center justify-end mb-6">
            <Link
              href="/admin/design"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-bone/50 hover:text-gold transition-colors"
            >
              <Settings size={13} /> ledger admin
            </Link>
          </div>
          <DesignLedger />
        </div>
      </section>

      <Footer />
    </main>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ChevronsDown, MapPin } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { OPEN_SPOTS, PAST_SPOTS } from "@/lib/guest";
import { IMG } from "@/lib/images";

export const metadata = { title: ".guest — fi.artistry" };

export default function GuestPage() {
  // group past spots by year (using date if present, else "Archive")
  const byYear: Record<string, typeof PAST_SPOTS> = {};
  for (const s of PAST_SPOTS) {
    const year = s.date ? s.date.slice(0, 4) : "Archive";
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(s);
  }
  const yearKeys = Object.keys(byYear).sort((a, b) => {
    if (a === "Archive") return 1;
    if (b === "Archive") return -1;
    return b.localeCompare(a);
  });

  return (
    <main className="relative">
      <Header />

      {/* Hero — same compact category pattern */}
      <section className="relative isolate h-[40svh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <Image
          src={IMG.worksHero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />

        <div className="relative z-10 text-center px-6">
          <h1 className="font-display text-5xl sm:text-6xl md:text-[5rem] leading-none tracking-tight text-bone">
            .guest
          </h1>
          <a
            href="#current"
            aria-label="Scroll to guest spots"
            className="mt-6 inline-flex justify-center text-bone/80 hover:text-gold transition-colors"
          >
            <ChevronsDown size={42} strokeWidth={1.2} className="animate-floaty" />
          </a>
        </div>
      </section>

      {/* Tagline + current bookings — single white block */}
      <section id="current" className="relative pt-16 md:pt-20 pb-20 md:pb-28 bg-bone text-ink">
        <div className="mx-auto max-w-[1500px] px-6 md:px-10">
          <p className="font-display text-xl md:text-2xl lg:text-3xl leading-snug text-balance max-w-5xl mx-auto text-center">
            Stay updated on my current travels and submit appointment requests accordingly.
          </p>

          <div className="mt-16 md:mt-20 flex items-center gap-3 text-[11px] uppercase tracking-widest2 text-ink/60 font-mono mb-8">
            <span className="h-px w-8 bg-ink/40" />
            current bookings
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-ink/15">
            {OPEN_SPOTS.map((spot) => (
              <article
                key={`${spot.city}-${spot.window}`}
                className="bg-bone p-8 md:p-12 group hover:bg-bone-soft transition-colors"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest2 text-ink/60 mb-3">
                      <MapPin size={12} /> {spot.country}
                    </div>
                    <h3 className="font-display text-5xl md:text-6xl tracking-tight">
                      {spot.city}
                    </h3>
                    <p className="text-ink/60 text-sm mt-3">{spot.window}</p>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-ink/80">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inset-0 rounded-full bg-emerald-500 opacity-70" />
                        <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      Bookings are Open
                    </span>
                  </div>
                </div>

                <Link
                  href="/booking"
                  className="mt-8 inline-flex items-center gap-2 text-[12px] uppercase tracking-widest2 text-ink/70 hover:text-ink transition-colors"
                >
                  Reserve a slot →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Past tours timeline */}
      <section className="relative py-20 md:py-28 border-t border-ink-line">
        <div className="mx-auto max-w-[1500px] px-6 md:px-10">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest2 text-gold/90 font-mono mb-3">
            <span className="h-px w-8 bg-gold/60" />
            past tours
          </div>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight">
            Where I’ve been.
          </h2>
          <p className="mt-3 text-bone/60 max-w-2xl">
            A chronological log of every guest spot. From {PAST_SPOTS.length} stops across
            Europe, Asia and beyond.
          </p>

          <div className="mt-14 space-y-14 md:space-y-20">
            {yearKeys.map((year) => (
              <div key={year} className="grid md:grid-cols-12 gap-6 md:gap-10">
                <div className="md:col-span-3">
                  <div className="font-display text-5xl md:text-6xl tracking-tight gold-gradient">
                    {year}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest2 text-bone/40 mt-1 font-mono">
                    {byYear[year].length} stop{byYear[year].length === 1 ? "" : "s"}
                  </div>
                </div>
                <ul className="md:col-span-9 divide-y divide-ink-line border-t border-ink-line">
                  {byYear[year].map((s, idx) => (
                    <li
                      key={`${s.city}-${s.window}-${idx}`}
                      className="py-4 md:py-5 flex items-baseline justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="font-display text-2xl md:text-3xl tracking-tight">
                          {s.city}
                        </div>
                        <div className="text-[11px] uppercase tracking-widest2 text-bone/40 font-mono mt-1">
                          {s.country}
                        </div>
                      </div>
                      <div className="text-bone/60 text-sm md:text-base text-right shrink-0 whitespace-nowrap">
                        {s.window}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

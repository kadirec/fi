import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookingForm } from "@/components/booking-form";

export const metadata = { title: "Booking — fi.artistry" };

export default function BookingPage() {
  return (
    <main className="relative">
      <Header />

      <section className="pt-36 md:pt-44 pb-16">
        <div className="mx-auto px-6 md:px-10 max-w-[1400px]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-8 text-[11px] text-bone/60 hover:text-gold uppercase tracking-widest2"
          >
            <ArrowLeft size={14} /> back home
          </Link>
          <div className="flex items-center gap-3 mb-6 font-mono text-[11px] text-gold/90 uppercase tracking-widest2">
            <span className="bg-gold/60 w-8 h-px" />
            .booking
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[1] tracking-tight">
            Reserve a session.
          </h1>
          <p className="mt-6 max-w-2xl text-bone/65 text-lg">
            Tell me about your idea, the placement and the city you’d like to sit in. I’ll
            respond within a few days with availability.
          </p>
        </div>
      </section>

      <section className="pb-32">
        <div className="mx-auto px-6 md:px-10 max-w-[1400px]">
          <script src="https://elfsightcdn.com/platform.js" async></script>
          <div class="elfsight-app-0c7a31b6-d215-4e86-ab96-1f27573fe7c7" data-elfsight-app-lazy></div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

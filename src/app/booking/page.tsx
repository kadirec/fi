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
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-bone/60 hover:text-gold mb-8"
          >
            <ArrowLeft size={14} /> back home
          </Link>
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest2 text-gold/90 font-mono mb-6">
            <span className="h-px w-8 bg-gold/60" />
            .booking
          </div>
          <h1 className="font-display text-5xl md:text-7xl leading-[1] tracking-tight">
            Reserve a session.
          </h1>
          <p className="mt-6 text-bone/65 max-w-2xl text-lg">
            Tell me about your idea, the placement and the city you’d like to sit in. I’ll
            respond within a few days with availability.
          </p>
        </div>
      </section>

      <section className="pb-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <BookingForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}

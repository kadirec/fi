"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Images, Sparkles, CalendarCheck, Inbox } from "lucide-react";
import { useAdmin } from "./admin-shell";
import { SectionHeader } from "./section-header";

type Stats = {
  works: number;
  designs: { all: number; available: number; sold: number };
  bookings: { all: number; new: number };
  reservations: { all: number; new: number };
};

export function Overview() {
  const { authedFetch } = useAdmin();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/works").then((r) => r.json()),
      fetch("/api/designs").then((r) => r.json()),
      authedFetch("/api/bookings").then((r) => r.json()),
      authedFetch("/api/design-reservations").then((r) => r.json()),
    ]).then(([w, d, b, r]) => {
      const designs = d.designs ?? [];
      const bookings = b.bookings ?? [];
      const reservations = r.reservations ?? [];
      setStats({
        works: (w.works ?? []).length,
        designs: {
          all: designs.length,
          available: designs.filter((x: { status: string }) => x.status === "available").length,
          sold: designs.filter((x: { status: string }) => x.status === "sold").length,
        },
        bookings: {
          all: bookings.length,
          new: bookings.filter((x: { status: string }) => x.status === "new").length,
        },
        reservations: {
          all: reservations.length,
          new: reservations.filter((x: { status: string }) => x.status === "new").length,
        },
      });
    });
  }, [authedFetch]);

  const cards = [
    {
      label: "Works",
      value: stats?.works ?? "—",
      hint: "portfolio pieces",
      href: "/admin/works",
      Icon: Images,
    },
    {
      label: "Designs",
      value: stats ? `${stats.designs.available} / ${stats.designs.all}` : "—",
      hint: `${stats?.designs.sold ?? 0} sold`,
      href: "/admin/design",
      Icon: Sparkles,
    },
    {
      label: "Bookings",
      value: stats ? `${stats.bookings.new} new` : "—",
      hint: `${stats?.bookings.all ?? 0} total`,
      href: "/admin/booking",
      Icon: CalendarCheck,
    },
    {
      label: "Reservations",
      value: stats ? `${stats.reservations.new} new` : "—",
      hint: `${stats?.reservations.all ?? 0} total`,
      href: "/admin/reservations",
      Icon: Inbox,
    },
  ];

  return (
    <div>
      <SectionHeader title="Overview" hint="A quick read of the studio's current state." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ label, value, hint, href, Icon }) => (
          <Link
            key={label}
            href={href}
            className="group relative border border-ink-line hover:border-gold/60 transition-colors p-6 flex flex-col gap-6"
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest2 text-bone/50">
                <Icon size={14} /> {label}
              </div>
              <ArrowUpRight
                size={16}
                className="text-bone/30 group-hover:text-gold group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition"
              />
            </div>
            <div>
              <div className="font-display text-4xl">{value}</div>
              <div className="text-[11px] uppercase tracking-widest2 text-bone/40 mt-1">
                {hint}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 border border-ink-line p-6">
        <div className="text-[10px] uppercase tracking-widest2 text-gold/80 font-mono mb-3">
          quick actions
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/works?upload=1"
            className="px-4 py-2 border border-bone/15 hover:border-gold hover:text-gold text-[11px] uppercase tracking-widest2 transition-colors"
          >
            + add a work
          </Link>
          <Link
            href="/admin/design?upload=1"
            className="px-4 py-2 border border-bone/15 hover:border-gold hover:text-gold text-[11px] uppercase tracking-widest2 transition-colors"
          >
            + add a design
          </Link>
          <Link
            href="/admin/booking"
            className="px-4 py-2 border border-bone/15 hover:border-gold hover:text-gold text-[11px] uppercase tracking-widest2 transition-colors"
          >
            → review bookings
          </Link>
        </div>
      </div>
    </div>
  );
}

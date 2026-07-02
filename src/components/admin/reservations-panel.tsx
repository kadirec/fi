"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Mail, Phone, Trash2 } from "lucide-react";
import { useAdmin } from "./admin-shell";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/cn";

type Reservation = {
  id: string;
  designId: string;
  designTitle: string;
  designOrder: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
};

const STATUSES = ["new", "contacted", "confirmed", "done", "archived"] as const;

function statusClasses(status: string) {
  switch (status) {
    case "new":
      return "bg-gold text-ink";
    case "contacted":
      return "bg-bone/10 text-bone border border-bone/20";
    case "confirmed":
      return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30";
    case "done":
      return "bg-bone/5 text-bone/50 border border-bone/10";
    default:
      return "bg-ink-soft text-bone/40 border border-bone/10";
  }
}

export function ReservationsPanel() {
  const { authedFetch } = useAdmin();
  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | (typeof STATUSES)[number]>("all");
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const r = await authedFetch("/api/design-reservations");
      const d = await r.json();
      setItems(d.reservations ?? []);
    } finally {
      setLoading(false);
    }
  }, [authedFetch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function updateStatus(b: Reservation, status: string) {
    setBusy(b.id);
    setItems((bs) => bs.map((x) => (x.id === b.id ? { ...x, status } : x)));
    await authedFetch(`/api/design-reservations/${b.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
  }

  async function remove(b: Reservation) {
    if (!confirm(`Delete reservation from ${b.name}?`)) return;
    setBusy(b.id);
    setItems((bs) => bs.filter((x) => x.id !== b.id));
    await authedFetch(`/api/design-reservations/${b.id}`, { method: "DELETE" });
    setBusy(null);
  }

  const counts = {
    all: items.length,
    new: items.filter((b) => b.status === "new").length,
    contacted: items.filter((b) => b.status === "contacted").length,
    confirmed: items.filter((b) => b.status === "confirmed").length,
    done: items.filter((b) => b.status === "done").length,
    archived: items.filter((b) => b.status === "archived").length,
  };
  const filtered = filter === "all" ? items : items.filter((b) => b.status === filter);

  return (
    <div>
      <SectionHeader
        title="Design Reservations"
        hint={`${counts.new} awaiting reply.`}
      />

      <div className="flex items-center gap-2 mb-5 overflow-x-auto -mx-1 px-1">
        {(["all", ...STATUSES] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={cn(
              "shrink-0 px-3 py-1.5 text-[11px] uppercase tracking-widest2 border inline-flex items-center gap-1.5",
              filter === k ? "border-gold text-gold" : "border-bone/15 text-bone/60"
            )}
          >
            {k}
            <span className="font-mono text-bone/50">{counts[k as keyof typeof counts]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-bone/5 h-28" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-ink-line py-16 text-center text-bone/60">
          No reservations here.
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((b) => (
            <li key={b.id} className="border border-ink-line p-4 md:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-widest2 font-mono text-gold">
                      #{String(b.designOrder).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-xl">{b.designTitle}</h3>
                    <span
                      className={cn(
                        "px-2 py-0.5 text-[9px] uppercase tracking-widest2 font-mono",
                        statusClasses(b.status)
                      )}
                    >
                      {b.status}
                    </span>
                  </div>
                  <p className="mt-1 text-bone/85">{b.name}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-bone/60">
                    <a
                      href={`mailto:${b.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-gold"
                    >
                      <Mail size={12} /> {b.email}
                    </a>
                    <a
                      href={`tel:${b.phone}`}
                      className="inline-flex items-center gap-1.5 hover:text-gold"
                    >
                      <Phone size={12} /> {b.phone}
                    </a>
                    <span className="text-bone/30">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b, e.target.value)}
                    disabled={busy === b.id}
                    className="bg-ink border border-bone/15 text-[10px] uppercase tracking-widest2 text-bone/70 px-2 py-2"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => updateStatus(b, "confirmed")}
                    disabled={busy === b.id}
                    className="p-2 text-bone/50 hover:text-emerald-300"
                    aria-label="confirm"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                  <button
                    onClick={() => remove(b)}
                    disabled={busy === b.id}
                    className="p-2 text-bone/50 hover:text-red-400"
                    aria-label="delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

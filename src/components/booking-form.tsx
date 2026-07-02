"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { PhoneField } from "./phone-field";

export function BookingForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries()) as Record<string, string>;
    payload.phone = phone;
    try {
      const r = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.error ?? `Request failed (${r.status})`);
      }
      setDone(true);
      (e.target as HTMLFormElement).reset();
      setPhone("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="border border-gold/40 p-8 md:p-10 text-center">
        <div className="text-[10px] uppercase tracking-widest2 text-gold mb-2 font-mono">
          received
        </div>
        <h2 className="font-display text-3xl">Thank you.</h2>
        <p className="mt-3 text-bone/70 max-w-md mx-auto">
          Your idea is with me. I’ll get back within a few days with availability and the
          next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-5 max-w-2xl">
      <label className="block">
        <span className="text-[10px] uppercase tracking-widest2 text-bone/50">your name</span>
        <input
          name="name"
          required
          className="mt-2 w-full bg-transparent border-b border-bone/20 focus:border-gold outline-none py-3 text-bone"
        />
      </label>
      <label className="block">
        <span className="text-[10px] uppercase tracking-widest2 text-bone/50">your email</span>
        <input
          name="email"
          type="email"
          required
          className="mt-2 w-full bg-transparent border-b border-bone/20 focus:border-gold outline-none py-3 text-bone"
        />
      </label>
      <div className="block">
        <span className="text-[10px] uppercase tracking-widest2 text-bone/50">phone (optional)</span>
        <div className="mt-2">
          <PhoneField value={phone} onChange={(full) => setPhone(full)} />
        </div>
      </div>
      <label className="block">
        <span className="text-[10px] uppercase tracking-widest2 text-bone/50">
          city / guest spot
        </span>
        <input
          name="city"
          className="mt-2 w-full bg-transparent border-b border-bone/20 focus:border-gold outline-none py-3 text-bone"
        />
      </label>
      <label className="block md:col-span-2">
        <span className="text-[10px] uppercase tracking-widest2 text-bone/50">
          placement & size
        </span>
        <input
          name="placement"
          className="mt-2 w-full bg-transparent border-b border-bone/20 focus:border-gold outline-none py-3 text-bone"
        />
      </label>

      <label className="block md:col-span-2">
        <span className="text-[10px] uppercase tracking-widest2 text-bone/50">
          tell me about the idea
        </span>
        <textarea
          name="idea"
          required
          rows={5}
          className="mt-2 w-full bg-transparent border-b border-bone/20 focus:border-gold outline-none py-3 text-bone resize-none"
        />
      </label>

      {error && (
        <p className="md:col-span-2 text-red-400 text-xs uppercase tracking-widest2">
          {error}
        </p>
      )}

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-ink text-[11px] uppercase tracking-widest2 transition-colors disabled:opacity-50"
        >
          {busy ? (
            <>
              <Loader2 size={14} className="animate-spin" /> sending
            </>
          ) : (
            "send request →"
          )}
        </button>
      </div>
    </form>
  );
}

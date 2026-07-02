"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, RotateCcw, X } from "lucide-react";
import { PhoneField } from "./phone-field";

type Design = {
  id: string;
  title: string;
  order: number;
};

function newCaptcha() {
  return {
    a: Math.floor(Math.random() * 8) + 2,
    b: Math.floor(Math.random() * 8) + 1,
  };
}

export function ReservationModal({
  design,
  open,
  onClose,
  onSuccess,
}: {
  design: Design | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [captcha, setCaptcha] = useState(newCaptcha);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setPhone("");
      setCaptcha(newCaptcha());
      setCaptchaAnswer("");
      setError(null);
      setDone(false);
      setBusy(false);
    }
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!design) return;
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/design-reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designId: design.id,
          name,
          email,
          phone,
          captchaA: captcha.a,
          captchaB: captcha.b,
          captchaAnswer,
        }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.error ?? `Request failed (${r.status})`);
      }
      setDone(true);
      onSuccess?.();
    } catch (err) {
      setError((err as Error).message);
      setCaptcha(newCaptcha());
      setCaptchaAnswer("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && design && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] bg-ink/95 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md bg-ink border border-ink-line p-6 md:p-8 rounded-t-2xl md:rounded-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-widest2 text-gold/80 font-mono mb-1">
                  reserve · #{String(design.order).padStart(2, "0")}
                </div>
                <h3 className="font-display text-2xl">{design.title}</h3>
              </div>
              <button onClick={onClose} aria-label="Close" className="text-bone/60 hover:text-bone">
                <X size={20} />
              </button>
            </div>

            {done ? (
              <div className="py-6 text-center">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-500/15 text-emerald-300 mb-3">
                  <Check size={20} />
                </div>
                <h4 className="font-display text-xl">Reservation received.</h4>
                <p className="mt-2 text-bone/60 text-sm">
                  I’ll get in touch within a few days to confirm the next steps.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 border border-bone/20 hover:border-gold text-bone hover:text-gold text-[11px] uppercase tracking-widest2 transition-colors"
                >
                  close
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-4">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-widest2 text-bone/50">
                    full name
                  </span>
                  <input
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 w-full bg-transparent border-b border-bone/20 focus:border-gold outline-none py-2 text-bone"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-widest2 text-bone/50">
                    email
                  </span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full bg-transparent border-b border-bone/20 focus:border-gold outline-none py-2 text-bone"
                  />
                </label>
                <div className="block">
                  <span className="text-[10px] uppercase tracking-widest2 text-bone/50">
                    phone
                  </span>
                  <div className="mt-1.5">
                    <PhoneField value={phone} onChange={(full) => setPhone(full)} required />
                  </div>
                </div>

                <div className="mt-2 flex items-end gap-3">
                  <label className="block flex-1">
                    <span className="text-[10px] uppercase tracking-widest2 text-bone/50">
                      not a robot — what is{" "}
                      <span className="text-gold font-mono">
                        {captcha.a} + {captcha.b}
                      </span>
                      ?
                    </span>
                    <input
                      required
                      inputMode="numeric"
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value)}
                      className="mt-1.5 w-full bg-transparent border-b border-bone/20 focus:border-gold outline-none py-2 text-bone font-mono"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setCaptcha(newCaptcha());
                      setCaptchaAnswer("");
                    }}
                    className="p-2 text-bone/50 hover:text-gold"
                    aria-label="New captcha"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>

                {error && (
                  <p className="text-red-400 text-xs uppercase tracking-widest2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gold text-ink hover:bg-bone text-[12px] uppercase tracking-widest2 transition-colors disabled:opacity-60"
                >
                  {busy ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> sending
                    </>
                  ) : (
                    "reserve now"
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

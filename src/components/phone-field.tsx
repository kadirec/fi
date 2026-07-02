"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { COUNTRIES, DEFAULT_COUNTRY, findCountryByDial, UNKNOWN_FLAG } from "@/lib/countries";
import { cn } from "@/lib/cn";

interface Props {
  value?: string;
  onChange: (full: string, parts: { dial: string; number: string }) => void;
  required?: boolean;
  autoFocus?: boolean;
  name?: string;
  placeholder?: string;
}

export function PhoneField({ value, onChange, required, autoFocus, name, placeholder }: Props) {
  const [dial, setDial] = useState<string>(DEFAULT_COUNTRY.dial);
  const [number, setNumber] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  // Sync from outside value if provided
  useEffect(() => {
    if (!value) return;
    const m = value.match(/^\+?(\d{1,4})[\s-]*(.*)$/);
    if (m) {
      setDial(m[1]);
      setNumber(m[2]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onChange(`+${dial} ${number}`.trim(), { dial, number });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dial, number]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const country = findCountryByDial(dial);
  const flag = country?.flag ?? UNKNOWN_FLAG;

  const filtered = search
    ? COUNTRIES.filter((c) => {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.dial.includes(q) ||
          c.code.toLowerCase().includes(q)
        );
      })
    : COUNTRIES;

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex items-center border-b border-bone/20 focus-within:border-gold gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 py-2 text-bone/90 hover:text-bone"
          aria-label="Pick country code"
        >
          <span className="text-lg leading-none">{flag}</span>
          <ChevronDown
            size={12}
            className={cn("text-bone/40 transition-transform", open && "rotate-180")}
          />
        </button>
        <span className="text-bone/50 font-mono select-none">+</span>
        <input
          inputMode="numeric"
          value={dial}
          onChange={(e) => setDial(e.target.value.replace(/\D/g, "").slice(0, 4))}
          className="w-10 bg-transparent outline-none text-bone font-mono py-2"
          aria-label="Country dial code"
        />
        <input
          name={name}
          required={required}
          autoFocus={autoFocus}
          type="tel"
          inputMode="tel"
          placeholder={placeholder ?? "555 555 55 55"}
          value={number}
          onChange={(e) => setNumber(e.target.value.replace(/[^\d\s-]/g, "").slice(0, 20))}
          className="flex-1 bg-transparent outline-none py-2 text-bone"
        />
      </div>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 max-h-72 overflow-hidden bg-ink border border-ink-line shadow-xl flex flex-col">
          <div className="flex items-center gap-2 border-b border-ink-line px-3 py-2">
            <Search size={14} className="text-bone/40" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search country…"
              className="flex-1 bg-transparent outline-none text-sm text-bone placeholder:text-bone/30"
            />
          </div>
          <ul className="overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-3 py-4 text-bone/50 text-sm">No match</li>
            ) : (
              filtered.map((c) => (
                <li key={`${c.code}-${c.dial}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setDial(c.dial);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-bone/5 transition-colors",
                      c.dial === dial && "bg-bone/5"
                    )}
                  >
                    <span className="text-lg leading-none">{c.flag}</span>
                    <span className="flex-1 truncate text-bone/90 text-sm">{c.name}</span>
                    <span className="text-bone/40 font-mono text-xs">+{c.dial}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

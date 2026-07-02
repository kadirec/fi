"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, Images, Sparkles, CalendarCheck, ShoppingBag, Inbox } from "lucide-react";
import { cn } from "@/lib/cn";

const TOKEN_KEY = "fi.admin.token";

type Ctx = {
  token: string;
  authedFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  logout: () => void;
};
const AdminContext = createContext<Ctx | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside AdminShell");
  return ctx;
}

const NAV = [
  { href: "/admin", label: "overview", Icon: LayoutDashboard, end: true },
  { href: "/admin/works", label: "works", Icon: Images },
  { href: "/admin/design", label: "design", Icon: Sparkles },
  { href: "/admin/reservations", label: "reserv.", Icon: Inbox },
  { href: "/admin/booking", label: "booking", Icon: CalendarCheck },
  { href: "/admin/shop", label: "shop", Icon: ShoppingBag },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (t) setToken(t);
    setReady(true);
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const r = await fetch("/api/designs", {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenInput}` },
    });
    if (r.status === 401) {
      setError("Wrong token. Try again.");
      return;
    }
    localStorage.setItem(TOKEN_KEY, tokenInput);
    setToken(tokenInput);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  if (!ready) return null;

  if (!token) {
    return (
      <div className="min-h-[100svh] flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest2 text-gold/90 font-mono mb-4">
            <span className="h-px w-8 bg-gold/60" /> .admin
          </div>
          <h1 className="font-display text-4xl tracking-tight">Unlock the studio.</h1>
          <p className="mt-3 text-bone/60 text-sm">
            Manage works, designs, bookings and shop from one place.
          </p>
          <form onSubmit={login} className="mt-8 flex flex-col gap-4">
            <input
              type="password"
              autoFocus
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="admin token"
              className="w-full bg-transparent border border-bone/20 focus:border-gold outline-none px-4 py-4 text-base"
            />
            {error && (
              <p className="text-[11px] uppercase tracking-widest2 text-red-400">{error}</p>
            )}
            <button
              type="submit"
              className="px-5 py-4 border border-gold text-gold hover:bg-gold hover:text-ink uppercase tracking-widest2 text-[11px] transition-colors"
            >
              enter
            </button>
            <Link
              href="/"
              className="text-center text-[11px] uppercase tracking-widest2 text-bone/40 hover:text-bone"
            >
              ← back to site
            </Link>
          </form>
        </div>
      </div>
    );
  }

  const authedFetch: Ctx["authedFetch"] = (input, init = {}) =>
    fetch(input, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    });

  return (
    <AdminContext.Provider value={{ token, authedFetch, logout }}>
      <div className="min-h-[100svh] pb-28 md:pb-12">
        {/* top bar */}
        <header className="sticky top-0 z-30 bg-ink/85 backdrop-blur-md border-b border-ink-line">
          <div className="mx-auto max-w-[1200px] px-4 md:px-8 py-3 flex items-center justify-between gap-3">
            <Link href="/admin" className="font-display text-xl tracking-tight">
              fi<span className="text-bone/50">.admin</span>
            </Link>

            {/* desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV.map(({ href, label, Icon, end }) => {
                const isActive = end ? pathname === href : pathname?.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-2 text-[12px] uppercase tracking-widest2 border transition-colors",
                      isActive
                        ? "border-gold text-gold"
                        : "border-transparent text-bone/60 hover:text-bone"
                    )}
                  >
                    <Icon size={14} /> {label}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest2 text-bone/60 hover:text-gold"
            >
              <LogOut size={14} /> lock
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1200px] px-4 md:px-8 py-5 md:py-8">{children}</div>

        {/* mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-ink/95 backdrop-blur-md border-t border-ink-line">
          <div className="grid grid-cols-6">
            {NAV.map(({ href, label, Icon, end }) => {
              const isActive = end ? pathname === href : pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-2.5 text-[9px] uppercase tracking-widest2",
                    isActive ? "text-gold" : "text-bone/60"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </AdminContext.Provider>
  );
}

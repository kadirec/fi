"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/cn";

function BookingIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M8 3v4M16 3v4" />
    </svg>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-40 transition-colors duration-300",
          scrolled ? "bg-ink/55 backdrop-blur-md" : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-[1500px] px-6 md:px-10 h-20 md:h-24 flex items-center justify-between gap-6">
          <Link href="/" className="block">
            <Image
              src="/images/logo.webp"
              alt="fi.artistry"
              width={92}
              height={98}
              priority
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-10 lg:gap-14 absolute left-1/2 -translate-x-1/2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[17px] text-bone hover:text-gold transition-colors relative group"
              >
                {item.label}
                {item.badge === "new" && <span className="new-badge">new</span>}
                <span className="absolute -bottom-1.5 left-0 w-0 group-hover:w-full h-px bg-gold transition-all duration-500" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 ml-auto">
            <Link
              href={SITE.bookingUrl}
              className="hidden md:inline-flex items-center gap-2.5 bg-white text-ink rounded-full pl-4 pr-6 py-3 hover:bg-gold transition-colors shadow-sm"
            >
              <BookingIcon size={22} />
              <span className="text-[16px]">.booking</span>
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-bone"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-ink md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
              <Image src="/images/logo.webp" alt="fi.artistry" width={92} height={98} className="h-10 w-auto" />
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col px-6 py-8 gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="relative inline-flex items-center gap-3 font-display text-4xl py-3 border-b border-white/10 hover:text-gold"
                >
                  {item.label}
                  {item.badge === "new" && (
                    <span className="new-badge !static !top-auto !right-auto">new</span>
                  )}
                </Link>
              ))}
              <Link
                href={SITE.bookingUrl}
                onClick={() => setOpen(false)}
                className="mt-8 inline-flex items-center gap-2 bg-white text-ink rounded-full px-5 py-3 justify-center"
              >
                <BookingIcon size={18} /> .booking
              </Link>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

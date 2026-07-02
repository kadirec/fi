"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Instagram, Mail, Phone } from "lucide-react";
import { NAV, SITE } from "@/lib/site";
import { IMG } from "@/lib/images";

const LEGAL = [
  { href: "#", label: "Personal Data Policy" },
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "User Agreement" },
  { href: "#", label: "FAQ" },
];

function PinterestIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.971 1.172-4.971s-.299-.6-.299-1.486c0-1.391.806-2.428 1.81-2.428.853 0 1.265.64 1.265 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.481 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 0 1 .069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.472 6.165 5.775 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.526-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488" />
    </svg>
  );
}

interface SocialCardProps {
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  handle: string;
  icon: React.ReactNode;
}

function SocialCard({ href, image, imageAlt, title, handle, icon }: SocialCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative flex flex-col items-center bg-bone text-ink rounded-3xl px-6 pt-8 pb-6 transition-transform hover:-translate-y-1"
    >
      <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden ring-1 ring-ink/10">
        <Image src={image} alt={imageAlt} fill sizes="96px" className="object-cover" />
      </div>
      <h3 className="mt-5 text-xl md:text-2xl font-medium tracking-tight">{title}</h3>
      <p className="mt-1 text-xs text-ink/50">{handle}</p>

      <div className="mt-5 inline-flex items-center gap-2 bg-ink text-bone rounded-full pl-4 pr-1 py-1">
        <span className="text-xs">follow me!</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bone text-ink transition-transform group-hover:rotate-12">
          {icon}
        </span>
      </div>
    </a>
  );
}

export function Footer() {
  const phoneDigits = SITE.phone.replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${phoneDigits}`;

  return (
    <footer className="relative border-t border-ink-line bg-ink">
      <div className="mx-auto max-w-7xl px-5 md:px-8 pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-12 gap-10"
        >
          <div className="md:col-span-4">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl tracking-tight">fi</span>
              <span className="text-bone/50 text-xs uppercase tracking-widest2">.artistry</span>
            </div>
            <p className="mt-4 text-bone/50 text-sm max-w-sm">
              Custom fine line and micro-realism — drawn for the people who carry them.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-bone/70">
              <li>
                <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 hover:text-gold">
                  <Mail size={15} className="text-bone/50" />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={`tel:${phoneDigits}`} className="inline-flex items-center gap-2 hover:text-gold">
                  <Phone size={15} className="text-bone/50" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 hover:text-gold"
                >
                  <WhatsAppIcon size={15} />
                  Whatsapp DM
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-[10px] uppercase tracking-widest2 text-bone/40 mb-4">
              Navigate
            </div>
            <ul className="space-y-2">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-sm text-bone/70 hover:text-gold">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-6 grid grid-cols-2 gap-4">
            <SocialCard
              href={SITE.instagram}
              image={IMG.socialInstagram}
              imageAlt="Instagram"
              title="Instagram"
              handle={SITE.instagramHandle}
              icon={<Instagram size={16} />}
            />
            <SocialCard
              href={SITE.pinterest}
              image={IMG.socialPinterest}
              imageAlt="Pinterest"
              title="Pinterest"
              handle={SITE.pinterestHandle}
              icon={<PinterestIcon size={16} />}
            />
          </div>
        </motion.div>

        <div className="hairline my-12" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-[11px] uppercase tracking-widest2 text-bone/40">
          <span>© {new Date().getFullYear()} fi.artistry — all rights reserved</span>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="hover:text-bone">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div
          aria-hidden
          className="mt-16 font-display text-[20vw] leading-none tracking-tighter text-bone/[0.06] select-none text-center"
        >
          fi.artistry
        </div>
      </div>
    </footer>
  );
}

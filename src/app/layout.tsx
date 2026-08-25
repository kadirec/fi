import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { PAGE_SEO, personJsonLd, tattooBusinessJsonLd, websiteJsonLd, jsonLdScriptProps } from "@/lib/seo";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: PAGE_SEO.home.title,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.artist, url: SITE.url }],
  creator: SITE.artist,
  publisher: SITE.artist,
  keywords: [...SITE.keywords],
  category: "Tattoo Art",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: PAGE_SEO.home.title,
    description: SITE.description,
    url: SITE.url,
    locale: "en_US",
    alternateLocale: ["de_DE", "nl_NL", "fr_FR", "tr_TR"],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_SEO.home.title,
    description: SITE.shortDescription,
    creator: SITE.instagramHandle,
    site: SITE.instagramHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { email: false, address: false, telephone: false },
  verification: {},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="font-sans">
        {children}
        <script {...jsonLdScriptProps(personJsonLd())} />
        <script {...jsonLdScriptProps(tattooBusinessJsonLd())} />
        <script {...jsonLdScriptProps(websiteJsonLd())} />
      </body>
    </html>
  );
}

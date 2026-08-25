import { SITE } from "./site";
import { PAST_SPOTS, OPEN_SPOTS } from "./guest";

export const PAGE_SEO = {
  home: {
    title: `${SITE.artist} — Fine Line & Micro-Realism Tattoo Artist`,
    description: SITE.description,
    path: "/",
  },
  works: {
    title: "Portfolio — Fine Line & Micro-Realism Tattoos",
    description:
      "A selected portfolio of fine line and micro-realism tattoos by Firat Yucedag. Each piece is drawn from scratch, one-of-a-kind, inked in İzmir and on guest spots across Europe.",
    path: "/works",
  },
  design: {
    title: "Design Ledger — Available Fine Line Tattoo Designs",
    description:
      "A living ledger of ready-made fine line and micro-realism tattoo designs by Firat Yucedag. Each design is drawn from scratch and inked only once — reserve one before it finds its person.",
    path: "/design",
  },
  guest: {
    title: "Guest Spots & European Tour",
    description:
      "Current tattoo guest spots in Hamburg, Amsterdam, Munich and a year-round residency in İzmir. Explore a chronological log of past stops across Europe, Asia and beyond.",
    path: "/guest",
  },
  booking: {
    title: "Booking — Request a Custom Tattoo",
    description:
      "Request a custom fine line or micro-realism tattoo appointment with Firat Yucedag. Share your idea, choose an available city and let’s design something meaningful together.",
    path: "/booking",
  },
} as const;

export function absoluteUrl(path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${clean === "/" ? "" : clean}`;
}

/** Person schema.org JSON-LD for the artist. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE.url}#person`,
    name: SITE.artist,
    alternateName: SITE.name,
    jobTitle: "Tattoo Artist",
    description: SITE.description,
    image: `${SITE.url}/opengraph-image.jpg`,
    url: SITE.url,
    email: `mailto:${SITE.email}`,
    telephone: SITE.phoneE164,
    knowsAbout: [...SITE.styles],
    sameAs: [SITE.instagram, SITE.pinterest],
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.location.city,
      addressRegion: SITE.location.region,
      addressCountry: SITE.location.countryCode,
    },
  };
}

/** LocalBusiness / TattooParlor schema.org JSON-LD. */
export function tattooBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
    "@id": `${SITE.url}#business`,
    name: SITE.name,
    alternateName: `${SITE.artist} Tattoo`,
    description: SITE.description,
    url: SITE.url,
    image: `${SITE.url}/opengraph-image.jpg`,
    logo: `${SITE.url}/icon.png`,
    telephone: SITE.phoneE164,
    email: SITE.email,
    priceRange: "€€€",
    founder: { "@type": "Person", "@id": `${SITE.url}#person` },
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.location.city,
      addressRegion: SITE.location.region,
      addressCountry: SITE.location.countryCode,
    },
    areaServed: SITE.areasServed.map((c) => ({ "@type": "Country", name: c })),
    sameAs: [SITE.instagram, SITE.pinterest],
    makesOffer: SITE.styles.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: `${s} Tattoo` },
    })),
  };
}

/** WebSite schema. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.shortDescription,
    publisher: { "@id": `${SITE.url}#person` },
    inLanguage: "en",
  };
}

/** Event list for open guest spots + past stops (helps Google surface tour cities). */
export function guestSpotsJsonLd() {
  const openEvents = OPEN_SPOTS.map((s) => ({
    "@type": "Event",
    name: `Tattoo guest spot — ${s.city}`,
    description: `Fine line & micro-realism tattoo bookings open in ${s.city}, ${s.country}.`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: `${s.city}, ${s.country}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: s.city,
        addressCountry: s.country,
      },
    },
    performer: { "@id": `${SITE.url}#person` },
    organizer: { "@id": `${SITE.url}#business` },
    url: `${SITE.url}/booking`,
  }));

  const pastPlaces = PAST_SPOTS.map((s) => ({
    "@type": "Place",
    name: `${s.city}, ${s.country}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: s.city,
      addressCountry: s.country,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE.url}/guest#tour`,
    name: "Fine Line Tattoo Guest Spots & European Tour",
    itemListElement: [
      ...openEvents.map((e, i) => ({ "@type": "ListItem", position: i + 1, item: e })),
      ...pastPlaces.map((p, i) => ({
        "@type": "ListItem",
        position: openEvents.length + i + 1,
        item: p,
      })),
    ],
  };
}

/** Breadcrumb list JSON-LD for inner pages. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

/** Small helper for rendering JSON-LD safely. */
export function jsonLdScriptProps(data: unknown) {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  } as const;
}

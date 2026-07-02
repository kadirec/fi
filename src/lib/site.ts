export const SITE = {
  name: "fi.artistry",
  tagline: "Every line, every detail tells your unique story.",
  email: "hello@fiartistry.com",
  phone: "+90 (544) 663 69 23",
  instagram: "https://instagram.com/firatyucedag",
  instagramHandle: "@firatyucedag",
  instagramDM: "https://ig.me/m/firatyucedag",
  pinterest: "https://pinterest.com/fi.artistry",
  pinterestHandle: "fi.artistry",
  bookingUrl: "/booking",
} as const;

export const NAV = [
  { href: "/#me", label: ".me story", badge: null },
  { href: "/works", label: ".works", badge: null },
  { href: "/design", label: ".design", badge: "new" as const },
  { href: "/guest", label: ".guest", badge: null },
  { href: "/#shop", label: ".shop", badge: null },
] as const;


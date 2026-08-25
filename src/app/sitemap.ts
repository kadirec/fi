import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = SITE.url;
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/works`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/design`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/guest`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/booking`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}

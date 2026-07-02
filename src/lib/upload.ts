import { put, del } from "@vercel/blob";

const SAFE_EXTS = ["jpg", "jpeg", "png", "webp", "gif", "avif"];

export async function saveImage(file: File, subdir: "works" | "designs") {
  const ext = (file.name.match(/\.([a-z0-9]+)$/i)?.[1] ?? "webp").toLowerCase();
  const safeExt = SAFE_EXTS.includes(ext) ? ext : "webp";
  const fname = `${subdir}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const blob = await put(fname, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type || undefined,
  });
  return blob.url;
}

export async function deleteImage(url: string) {
  if (!url) return;
  try {
    await del(url);
  } catch {
    // ignore — image may already be gone or not a Blob URL
  }
}

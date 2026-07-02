import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthorized } from "@/lib/auth";
import { saveImage } from "@/lib/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured");
  const works = await prisma.work.findMany({
    where: featured === "true" ? { featured: true } : undefined,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ works });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") ?? "";
  let title = "";
  let description: string | undefined;
  let featured = false;
  let imageUrl = "";
  let width = 1200;
  let height = 1500;

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    title = String(form.get("title") ?? "").trim();
    description = form.get("description") ? String(form.get("description")) : undefined;
    featured = String(form.get("featured")) === "true";
    const file = form.get("image");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "image file required" }, { status: 400 });
    }
    if (!title) title = file.name.replace(/\.[^.]+$/, "");
    imageUrl = await saveImage(file, "works");
  } else {
    const body = await req.json();
    title = String(body.title ?? "").trim();
    description = body.description;
    featured = !!body.featured;
    imageUrl = body.imageUrl;
    width = body.width ?? width;
    height = body.height ?? height;
    if (!imageUrl || !title) {
      return NextResponse.json({ error: "title and imageUrl required" }, { status: 400 });
    }
  }

  const count = await prisma.work.count();
  const order = count + 1;
  const baseSlug = toSlug(title) || `work-${String(order).padStart(2, "0")}`;
  let slug = baseSlug;
  let i = 1;
  while (await prisma.work.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++i}`;
  }

  const work = await prisma.work.create({
    data: { slug, title, description, imageUrl, width, height, featured, order },
  });
  return NextResponse.json({ work }, { status: 201 });
}

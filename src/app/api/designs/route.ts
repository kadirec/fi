import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthorized } from "@/lib/auth";
import { saveImage } from "@/lib/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const designs = await prisma.design.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ designs });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const contentType = req.headers.get("content-type") ?? "";
  let title = "";
  let status = "available";
  let imageUrl = "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    title = String(form.get("title") ?? "").trim();
    status = String(form.get("status") ?? "available");
    const file = form.get("image");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "image file required" }, { status: 400 });
    }
    if (!title) title = file.name.replace(/\.[^.]+$/, "");
    imageUrl = await saveImage(file, "designs");
  } else {
    const body = await req.json();
    title = String(body.title ?? "").trim();
    status = body.status ?? "available";
    imageUrl = body.imageUrl;
    if (!imageUrl || !title) {
      return NextResponse.json({ error: "title and imageUrl required" }, { status: 400 });
    }
  }

  const count = await prisma.design.count();
  const design = await prisma.design.create({
    data: { title, imageUrl, status, order: count + 1 },
  });
  return NextResponse.json({ design }, { status: 201 });
}

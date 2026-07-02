import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthorized } from "@/lib/auth";
import { deleteImage } from "@/lib/upload";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const work =
    (await prisma.work.findUnique({ where: { id } })) ??
    (await prisma.work.findUnique({ where: { slug: id } }));
  if (!work) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ work });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.description === "string") data.description = body.description;
  if (typeof body.featured === "boolean") data.featured = body.featured;
  if (typeof body.order === "number") data.order = body.order;
  const work = await prisma.work.update({ where: { id }, data });
  return NextResponse.json({ work });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const work = await prisma.work.findUnique({ where: { id } });
  if (!work) return NextResponse.json({ error: "not found" }, { status: 404 });
  await deleteImage(work.imageUrl);
  await prisma.work.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

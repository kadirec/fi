import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthorized } from "@/lib/auth";
import { deleteImage } from "@/lib/upload";

export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.status === "string") data.status = body.status;
  if (typeof body.order === "number") data.order = body.order;
  const design = await prisma.design.update({ where: { id }, data });
  return NextResponse.json({ design });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const design = await prisma.design.findUnique({ where: { id } });
  if (!design) return NextResponse.json({ error: "not found" }, { status: 404 });
  await deleteImage(design.imageUrl);
  await prisma.design.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

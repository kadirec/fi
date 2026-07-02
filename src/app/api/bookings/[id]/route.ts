import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthorized } from "@/lib/auth";

const ALLOWED = new Set(["new", "contacted", "scheduled", "done", "archived"]);

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (typeof body.status === "string" && ALLOWED.has(body.status)) data.status = body.status;
  const booking = await prisma.booking.update({ where: { id }, data });
  return NextResponse.json({ booking });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.booking.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

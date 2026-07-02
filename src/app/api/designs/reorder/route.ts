import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthorized } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const items: { id: string; order: number }[] = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "items required" }, { status: 400 });
  }
  await prisma.$transaction(
    items.map((it) =>
      prisma.design.update({ where: { id: it.id }, data: { order: it.order } })
    )
  );
  return NextResponse.json({ ok: true, count: items.length });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthorized } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? undefined;
  const bookings = await prisma.booking.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const idea = String(body.idea ?? "").trim();
  if (!name || !email || !idea) {
    return NextResponse.json(
      { error: "name, email and idea are required" },
      { status: 400 }
    );
  }
  const booking = await prisma.booking.create({
    data: {
      name,
      email,
      phone: body.phone ? String(body.phone) : null,
      city: body.city ? String(body.city) : null,
      placement: body.placement ? String(body.placement) : null,
      idea,
      status: "new",
    },
  });
  return NextResponse.json({ booking }, { status: 201 });
}

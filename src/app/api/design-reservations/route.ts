import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthorized } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? undefined;
  const reservations = await prisma.designReservation.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ reservations });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const designId = String(body.designId ?? "").trim();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const captchaAnswer = String(body.captchaAnswer ?? "").trim();
  const captchaA = Number(body.captchaA);
  const captchaB = Number(body.captchaB);

  if (!designId || !name || !email || !phone) {
    return NextResponse.json(
      { error: "all fields are required" },
      { status: 400 }
    );
  }

  if (
    Number.isNaN(captchaA) ||
    Number.isNaN(captchaB) ||
    String(captchaA + captchaB) !== captchaAnswer
  ) {
    return NextResponse.json(
      { error: "captcha failed" },
      { status: 400 }
    );
  }

  const design = await prisma.design.findUnique({ where: { id: designId } });
  if (!design) {
    return NextResponse.json({ error: "design not found" }, { status: 404 });
  }
  if (design.status === "sold") {
    return NextResponse.json(
      { error: "this piece has already found its place" },
      { status: 409 }
    );
  }

  const reservation = await prisma.designReservation.create({
    data: {
      designId: design.id,
      designTitle: design.title,
      designOrder: design.order,
      name,
      email,
      phone,
      status: "new",
    },
  });
  return NextResponse.json({ reservation }, { status: 201 });
}

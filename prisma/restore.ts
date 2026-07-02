import { PrismaClient } from "@prisma/client";
import { readFile } from "node:fs/promises";
import path from "node:path";

const prisma = new PrismaClient();

type WorkRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  imageUrl: string;
  width: number;
  height: number;
  featured: number | boolean;
  order: number;
  createdAt: number | string;
  updatedAt: number | string;
};

type DesignRow = {
  id: string;
  title: string;
  imageUrl: string;
  width: number;
  height: number;
  status: string;
  order: number;
  createdAt: number | string;
  updatedAt: number | string;
};

type DesignReservationRow = {
  id: string;
  designId: string;
  designTitle: string;
  designOrder: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: number | string;
  updatedAt: number | string;
};

type BookingRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  placement: string | null;
  idea: string;
  status: string;
  createdAt: number | string;
  updatedAt: number | string;
};

type Dump = {
  works: WorkRow[];
  designs: DesignRow[];
  designReservations: DesignReservationRow[];
  bookings: BookingRow[];
};

function toDate(v: number | string): Date {
  if (typeof v === "number") return new Date(v);
  const n = Number(v);
  return Number.isFinite(n) && String(n) === v ? new Date(n) : new Date(v);
}

async function main() {
  const dumpPath = path.join(process.cwd(), "prisma", "data-dump.json");
  const raw = await readFile(dumpPath, "utf8");
  const data: Dump = JSON.parse(raw);

  await prisma.designReservation.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.design.deleteMany();
  await prisma.work.deleteMany();

  for (const w of data.works) {
    await prisma.work.create({
      data: {
        id: w.id,
        slug: w.slug,
        title: w.title,
        description: w.description,
        imageUrl: w.imageUrl,
        width: w.width,
        height: w.height,
        featured: Boolean(w.featured),
        order: w.order,
        createdAt: toDate(w.createdAt),
        updatedAt: toDate(w.updatedAt),
      },
    });
  }

  for (const d of data.designs) {
    await prisma.design.create({
      data: {
        id: d.id,
        title: d.title,
        imageUrl: d.imageUrl,
        width: d.width,
        height: d.height,
        status: d.status,
        order: d.order,
        createdAt: toDate(d.createdAt),
        updatedAt: toDate(d.updatedAt),
      },
    });
  }

  for (const r of data.designReservations) {
    await prisma.designReservation.create({
      data: {
        id: r.id,
        designId: r.designId,
        designTitle: r.designTitle,
        designOrder: r.designOrder,
        name: r.name,
        email: r.email,
        phone: r.phone,
        status: r.status,
        createdAt: toDate(r.createdAt),
        updatedAt: toDate(r.updatedAt),
      },
    });
  }

  for (const b of data.bookings) {
    await prisma.booking.create({
      data: {
        id: b.id,
        name: b.name,
        email: b.email,
        phone: b.phone,
        city: b.city,
        placement: b.placement,
        idea: b.idea,
        status: b.status,
        createdAt: toDate(b.createdAt),
        updatedAt: toDate(b.updatedAt),
      },
    });
  }

  console.log(
    `Restored: works=${data.works.length}, designs=${data.designs.length}, reservations=${data.designReservations.length}, bookings=${data.bookings.length}`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

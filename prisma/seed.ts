import { PrismaClient } from "@prisma/client";
import { WORK_IMAGES } from "../src/lib/images";

const prisma = new PrismaClient();

const works = WORK_IMAGES.map((img, i) => {
  const n = i + 1;
  const slug = `work-${String(n).padStart(2, "0")}`;
  return {
    slug,
    title: `Piece №${String(n).padStart(2, "0")}`,
    description: null,
    imageUrl: img.url,
    width: img.w,
    height: img.h,
    featured: n <= 6,
    order: n,
  };
});

async function main() {
  await prisma.work.deleteMany();
  for (const work of works) {
    await prisma.work.create({ data: work });
  }
  console.log(`Seeded ${works.length} works.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

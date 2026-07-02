import { PrismaClient } from "@prisma/client";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const prisma = new PrismaClient();

type FsDoc = {
  fields: Record<
    string,
    | { stringValue: string }
    | { integerValue: string }
    | { booleanValue: boolean }
    | { timestampValue: string }
  >;
};

async function main() {
  const url =
    "https://firestore.googleapis.com/v1/projects/fiartistry-design-ledger/databases/(default)/documents/designs?pageSize=500&key=AIzaSyDf8pDSuvT1Qkp-zC38uZ35uzIWJ517nPw";
  const r = await fetch(url);
  const data = (await r.json()) as { documents?: FsDoc[] };
  const docs = data.documents ?? [];
  console.log(`Fetched ${docs.length} designs from Firestore.`);

  function pickString(d: FsDoc, key: string): string | undefined {
    const f = d.fields?.[key];
    if (!f) return undefined;
    if ("stringValue" in f) return f.stringValue;
    return undefined;
  }
  function pickInt(d: FsDoc, key: string): number | undefined {
    const f = d.fields?.[key];
    if (!f) return undefined;
    if ("integerValue" in f) return Number(f.integerValue);
    return undefined;
  }

  // sort by number ascending
  docs.sort((a, b) => (pickInt(a, "number") ?? 0) - (pickInt(b, "number") ?? 0));

  const outDir = path.join(process.cwd(), "public", "uploads", "designs");
  await mkdir(outDir, { recursive: true });

  await prisma.design.deleteMany();

  let order = 1;
  for (const d of docs) {
    const title = pickString(d, "title") ?? `Design ${order}`;
    const status = pickString(d, "status") ?? "available";
    const dataUrl = pickString(d, "image") ?? "";

    const match = dataUrl.match(/^data:(image\/[^;]+);base64,(.*)$/);
    if (!match) {
      console.warn(`Skip ${title}: no inline image.`);
      continue;
    }
    const mime = match[1];
    const ext =
      mime === "image/jpeg" || mime === "image/jpg"
        ? "jpg"
        : mime === "image/png"
          ? "png"
          : mime === "image/webp"
            ? "webp"
            : "bin";
    const buf = Buffer.from(match[2], "base64");
    const safeTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const fname = `${String(order).padStart(2, "0")}-${safeTitle || "design"}.${ext}`;
    const filepath = path.join(outDir, fname);
    await writeFile(filepath, buf);

    await prisma.design.create({
      data: {
        title,
        status,
        imageUrl: `/uploads/designs/${fname}`,
        width: 566,
        height: 800,
        order,
      },
    });
    console.log(`#${order}  ${title}  ·  ${status}  ·  ${(buf.length / 1024).toFixed(0)} KB`);
    order++;
  }

  console.log(`Seeded ${order - 1} designs.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

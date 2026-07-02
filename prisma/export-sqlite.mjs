import { DatabaseSync } from "node:sqlite";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const db = new DatabaseSync(dbPath, { readOnly: true });

function dump(table) {
  return db.prepare(`SELECT * FROM ${table}`).all();
}

const data = {
  works: dump("Work"),
  designs: dump("Design"),
  designReservations: dump("DesignReservation"),
  bookings: dump("Booking"),
};

// Convert BigInts / boolean-as-int for JSON serializability
const replacer = (_k, v) => (typeof v === "bigint" ? Number(v) : v);
const out = path.join(process.cwd(), "prisma", "data-dump.json");
await writeFile(out, JSON.stringify(data, replacer, 2));

console.log(
  `Exported: works=${data.works.length}, designs=${data.designs.length}, reservations=${data.designReservations.length}, bookings=${data.bookings.length}`,
);
console.log(`Wrote ${out}`);

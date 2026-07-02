import { NextRequest } from "next/server";

export function isAuthorized(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const expected = `Bearer ${process.env.ADMIN_TOKEN ?? ""}`;
  return !!process.env.ADMIN_TOKEN && auth === expected;
}

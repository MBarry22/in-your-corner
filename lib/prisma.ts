import "dotenv/config";

// Supabase transaction pooler (port 6543) does not support prepared statements.
// Prisma must receive pgbouncer=true to disable them. Ensure it's set before the client is created.
const raw = process.env.DATABASE_URL;
if (raw?.includes("pooler.supabase.com") && !raw.includes("pgbouncer=true")) {
  const base = raw.split("?")[0].split("#")[0];
  const params = new URLSearchParams(raw.includes("?") ? raw.slice(raw.indexOf("?") + 1).split("#")[0] : "");
  params.set("pgbouncer", "true");
  process.env.DATABASE_URL = `${base}?${params.toString()}`;
}

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

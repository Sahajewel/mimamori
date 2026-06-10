/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const neonPool = new Pool({ connectionString: process.env.DATABASE_URL });

  // `as any` দেওয়ার কারণে টাইপের খটকা দূর হবে এবং বিল্ড সাকসেসফুল হবে
  const adapter = new PrismaNeon(neonPool as any);

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

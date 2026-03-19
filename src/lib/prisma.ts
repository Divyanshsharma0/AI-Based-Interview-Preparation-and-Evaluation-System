// @ts-ignore
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

// Initialize LibSQL Client Config
const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaLibSql({
  url: `file:${dbPath}`,
});

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const getPrisma = (): PrismaClient => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ["query"],
    });
  }
  return globalForPrisma.prisma;
};

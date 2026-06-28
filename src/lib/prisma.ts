import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const db =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter }).$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export { db };

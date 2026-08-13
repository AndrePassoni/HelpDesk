import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../env";

const isProd = env.DATABASE_URL?.includes('render.com') || process.env.NODE_ENV === 'production'

const pool = new Pool({ 
  connectionString: env.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: false } : undefined
});
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

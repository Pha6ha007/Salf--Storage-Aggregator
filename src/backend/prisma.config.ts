// prisma.config.ts — Prisma 7 configuration
// DATABASE_URL is injected by Railway/environment directly
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/prisma/schema.prisma",
  migrations: {
    path: "src/prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});

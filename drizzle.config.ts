import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({
    path: ".env.local",
});

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_TURSO_DB_URL!,
    authToken: process.env.NEXT_PUBLIC_TURSO_DB_AUTH_TOKEN!,
  },
});

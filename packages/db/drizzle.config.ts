// @ts-nocheck
import { defineConfig } from "drizzle-kit"

export default defineConfig({
   dialect: "postgresql",
   schema: "./src/schema/**/*.ts",
   out: "./src/migrations",
   // casing: "snake_case",
   dbCredentials: {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      url: process.env.DATABASE_URL!,
   },
   verbose: true,
})

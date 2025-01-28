// import { type NeonDatabase, drizzle } from "drizzle-orm/neon-serverless"
// import { Pool } from "@neondatabase/serverless"
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

export const initDb = (c: {
   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
   get: (arg0: string) => any
   env: { DATABASE_URL: string }
   set: (arg0: string, arg1: string) => void
}) => {
   let db = c.get("db")

   if (!db) {
      const client = postgres(c.env.DATABASE_URL)
      db = drizzle(client, {
         schema,
         casing: "camelCase",
      })

      c.set("db", db)
   }

   return db
}

export type Database = PostgresJsDatabase<typeof schema>

import { Pool } from "@neondatabase/serverless"
import { type NeonDatabase, drizzle } from "drizzle-orm/neon-serverless"
import * as schema from "./schema"

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const initDb = (c: any) => {
   let db = c.get("db")

   if (!db) {
      const client = new Pool({ connectionString: c.env.DATABASE_URL })
      db = drizzle(client, {
         schema,
         // casing: "snake_case",
      })

      c.set("db", db)
   }

   return db
}

export type Database = NeonDatabase

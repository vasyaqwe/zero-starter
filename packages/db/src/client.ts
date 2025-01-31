import type { ServerEnv } from "@project/env/types"
// import { type NeonDatabase, drizzle } from "drizzle-orm/neon-serverless"
// import { Pool } from "@neondatabase/serverless"
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

export const db = (c: {
   var: { env: Pick<ServerEnv, "DATABASE_URL"> }
}) => {
   const client = postgres(c.var.env.DATABASE_URL)

   return drizzle(client, {
      schema,
      casing: "camelCase",
   })
}

export type Database = PostgresJsDatabase<typeof schema>

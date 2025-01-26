import { boolean, primaryKey, text, uniqueIndex } from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-zod"
import type { z } from "zod"
import { createTable, tableId, timestamps } from "../utils"

export const user = createTable(
   "user",
   {
      id: tableId("user"),
      name: text().notNull(),
      email: text().notNull().unique(),
      image: text(),
      partner: boolean().notNull().default(false),
      ...timestamps,
   },
   (table) => [uniqueIndex().on(table.email)],
)

export const oauthProviders = ["github"] as const

export const oauthAccount = createTable(
   "oauth_account",
   {
      userId: text()
         .references(() => user.id, { onDelete: "cascade" })
         .notNull(),
      providerId: text({
         enum: oauthProviders,
      }).notNull(),
      providerUserId: text().notNull().unique(),
   },
   (table) => [
      primaryKey({
         columns: [table.providerId, table.providerUserId],
      }),
   ],
)

export const userSelectSchema = createSelectSchema(user).omit({
   createdAt: true,
   updatedAt: true,
})

export type User = z.infer<typeof userSelectSchema>

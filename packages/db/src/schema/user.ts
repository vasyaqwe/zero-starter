import { relations } from "drizzle-orm"
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
   "oauthAccount",
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

export const oauthAccountRelations = relations(oauthAccount, ({ one }) => ({
   user: one(user, {
      fields: [oauthAccount.userId],
      references: [user.id],
   }),
}))

export const userSelectSchema = createSelectSchema(user)

export type User = z.infer<typeof userSelectSchema>

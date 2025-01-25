import { relations } from "drizzle-orm"
import { boolean, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-zod"
import type { z } from "zod"
import { createTable, lifecycleDates, tableId } from "../utils"

export const medium = createTable("medium", {
   id: tableId(),
   name: text().notNull(),
})

export const message = createTable("message", {
   id: tableId(),
   senderId: text()
      .notNull()
      .references(() => user.id),
   mediumId: text()
      .notNull()
      .references(() => medium.id),
   body: text().notNull(),
   timestamp: timestamp().notNull(),
})

export const messageRelations = relations(message, ({ one }) => ({
   medium: one(medium),
   sender: one(user, {
      fields: [message.senderId],
      references: [user.id],
   }),
}))

export const user = createTable(
   "user",
   {
      id: tableId(),
      name: text().notNull(),
      email: text().notNull().unique(),
      image: text(),
      partner: boolean().notNull().default(false),
      ...lifecycleDates,
   },
   (table) => [uniqueIndex("user_email_idx").on(table.email)],
)

export const userSelectSchema = createSelectSchema(user).omit({
   createdAt: true,
   updatedAt: true,
})

export type User = z.infer<typeof userSelectSchema>

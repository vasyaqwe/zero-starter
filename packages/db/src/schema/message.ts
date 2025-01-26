import { relations } from "drizzle-orm"
import { text, timestamp } from "drizzle-orm/pg-core"
import { createTable, tableId } from "../utils"
import { user } from "./user"

export const message = createTable("message", {
   id: tableId("message"),
   senderId: text()
      .notNull()
      .references(() => user.id),
   mediumId: text()
      .notNull()
      .references(() => medium.id),
   body: text().notNull(),
   timestamp: timestamp().notNull(),
})

export const medium = createTable("medium", {
   id: tableId("medium"),
   name: text().notNull(),
})

export const messageRelations = relations(message, ({ one }) => ({
   medium: one(medium),
   sender: one(user, {
      fields: [message.senderId],
      references: [user.id],
   }),
}))

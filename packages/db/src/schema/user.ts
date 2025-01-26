import { boolean, text, uniqueIndex } from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-zod"
import type { z } from "zod"
import { createTable, lifecycleDates, tableId } from "../utils"

export const user = createTable(
   "user",
   {
      id: tableId("user"),
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

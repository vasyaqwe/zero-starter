import { customType, pgTable, text, timestamp } from "drizzle-orm/pg-core"

const tableId = () =>
   text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID())

const createTable = pgTable

const lifecycleDates = {
   createdAt: timestamp().$defaultFn(() => new Date()),
   updatedAt: timestamp()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
}

const bytea = customType<{ data: Uint8Array }>({
   dataType() {
      return "bytea"
   },
})

export { createTable, lifecycleDates, tableId, bytea }

import baseX from "base-x"
import { customType, pgTable, text, timestamp } from "drizzle-orm/pg-core"
const b58 = baseX("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
import crypto from "node:crypto"

const prefixes = {
   user: "usr",
   message: "msg",
   medium: "med",
} as const

const generateId = (prefix: keyof typeof prefixes) => {
   const buf = crypto.getRandomValues(new Uint8Array(20))

   /**
    * epoch starts more recently so that the 32-bit number space gives a
    * significantly higher useful lifetime of around 136 years
    * from 2023-11-14T22:13:20.000Z to 2159-12-22T04:41:36.000Z.
    */
   const EPOCH_TIMESTAMP = 1_700_000_000_000

   const t = Date.now() - EPOCH_TIMESTAMP

   buf[0] = (t >>> 24) & 255
   buf[1] = (t >>> 16) & 255
   buf[2] = (t >>> 8) & 255
   buf[3] = t & 255

   return `${prefixes[prefix]}_${b58.encode(buf)}` as const
}

const tableId = (prefix: keyof typeof prefixes) =>
   text()
      .primaryKey()
      .$defaultFn(() => generateId(prefix))

const createTable = pgTable

const timestamps = {
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

export { createTable, timestamps, tableId, bytea }

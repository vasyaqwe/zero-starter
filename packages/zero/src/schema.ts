import * as drizzleSchema from "@project/db/schema/index"
import {
   ANYONE_CAN,
   type ExpressionBuilder,
   NOBODY_CAN,
   type Row,
   definePermissions,
} from "@rocicorp/zero"
import { createZeroSchema } from "drizzle-zero"

export const schema = createZeroSchema(drizzleSchema, {
   version: 1,
   tables: {
      user: {
         id: true,
         email: true,
         name: true,
         image: true,
         partner: true,
         createdAt: true,
         updatedAt: true,
      },
      medium: {
         id: true,
         name: true,
      },
      message: {
         id: true,
         senderId: true,
         mediumId: true,
         body: true,
         timestamp: true,
      },
   },
})

export type Schema = typeof schema
export type Message = Row<typeof schema.tables.message>
export type Medium = Row<typeof schema.tables.medium>
export type User = Row<typeof schema.tables.user>

type AuthData = {
   sub: string | null
}

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
   const allowIfLoggedIn = (
      authData: AuthData,
      { cmpLit }: ExpressionBuilder<Schema, "user">,
   ) => cmpLit(authData.sub, "IS NOT", null)

   const allowIfMessageSender = (
      authData: AuthData,
      { cmp }: ExpressionBuilder<Schema, "message">,
   ) => cmp("senderId", "=", authData.sub ?? "")

   return {
      medium: {
         row: {
            insert: NOBODY_CAN,
            update: {
               preMutation: NOBODY_CAN,
            },
            delete: NOBODY_CAN,
         },
      },
      user: {
         row: {
            insert: NOBODY_CAN,
            update: {
               preMutation: NOBODY_CAN,
            },
            delete: NOBODY_CAN,
         },
      },
      message: {
         row: {
            // anyone can insert
            insert: ANYONE_CAN,
            // only sender can edit their own messages
            update: {
               preMutation: [allowIfMessageSender],
            },
            // must be logged in to delete
            delete: [allowIfLoggedIn],
         },
      },
   }
})

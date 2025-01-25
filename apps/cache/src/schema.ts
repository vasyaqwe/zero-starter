import {
   ANYONE_CAN,
   type ExpressionBuilder,
   NOBODY_CAN,
   type Row,
   boolean,
   createSchema,
   definePermissions,
   relationships,
   string,
   table,
} from "@rocicorp/zero"

const message = table("message")
   .columns({
      id: string(),
      senderId: string(),
      mediumId: string(),
      body: string(),
      timestamp: string(),
   })
   .primaryKey("id")

const user = table("user")
   .columns({
      id: string(),
      name: string(),
      email: string(),
      image: string().optional(),
      partner: boolean(),
      createdAt: string(),
      updatedAt: string(),
   })
   .primaryKey("id")

const medium = table("medium")
   .columns({
      id: string(),
      name: string(),
   })
   .primaryKey("id")

const messageRelationships = relationships(message, ({ one }) => ({
   sender: one({
      sourceField: ["senderId"],
      destField: ["id"],
      destSchema: user,
   }),
   medium: one({
      sourceField: ["mediumId"],
      destField: ["id"],
      destSchema: medium,
   }),
}))

export const schema = createSchema(1, {
   tables: [user, medium, message],
   relationships: [messageRelationships],
})

export type Schema = typeof schema
export type Message = Row<typeof schema.tables.message>
export type Medium = Row<typeof schema.tables.medium>
export type User = Row<typeof schema.tables.user>

// The contents of your decoded JWT.
type AuthData = {
   sub: string | null
}

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
   const allowIfLoggedIn = (
      authData: AuthData,
      { cmpLit }: ExpressionBuilder<Schema, keyof Schema["tables"]>,
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

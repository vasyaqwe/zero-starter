// import * as drizzleSchema from "@project/db/schema/index"
// import {
//    ANYONE_CAN,
//    type ExpressionBuilder,
//    NOBODY_CAN,
//    definePermissions,
// } from "@rocicorp/zero"
// import { createZeroSchema } from "drizzle-zero"

// export const schema = createZeroSchema(drizzleSchema, {
//    version: 1,
//    tables: {
//       user: {
//          id: true,
//          name: true,
//          email: true,
//          emailVerified: true,
//          image: true,
//          partner: true,
//          createdAt: true,
//          updatedAt: true,
//       },
//       account: {
//          id: true,
//          accountId: true,
//          providerId: true,
//          userId: true,
//          accessToken: true,
//          refreshToken: true,
//          idToken: true,
//          accessTokenExpiresAt: true,
//          refreshTokenExpiresAt: true,
//          scope: true,
//          password: true,
//          createdAt: true,
//          updatedAt: true,
//       },
//       session: {
//          id: true,
//          expiresAt: true,
//          token: true,
//          ipAddress: true,
//          userAgent: true,
//          userId: true,
//          createdAt: true,
//          updatedAt: true,
//       },
//       verification: {
//          id: true,
//          identifier: true,
//          value: true,
//          expiresAt: true,
//          createdAt: true,
//          updatedAt: true,
//       },
//       medium: {
//          id: true,
//          name: true,
//       },
//       message: {
//          id: true,
//          senderId: true,
//          mediumId: true,
//          body: true,
//          timestamp: true,
//       },
//    },
// })

// export type Schema = typeof schema

// type AuthData = {
//    sub: string | null
// }

// export const permissions = definePermissions<AuthData, Schema>(schema, () => {
//    const allowIfLoggedIn = (
//       authData: AuthData,
//       { cmpLit }: ExpressionBuilder<Schema, "user">,
//    ) => cmpLit(authData.sub, "IS NOT", null)

//    const allowIfMessageSender = (
//       authData: AuthData,
//       { cmp }: ExpressionBuilder<Schema, "message">,
//    ) => cmp("senderId", "=", authData.sub ?? "")

//    return {
//       medium: {
//          row: {
//             insert: NOBODY_CAN,
//             update: {
//                preMutation: NOBODY_CAN,
//             },
//             delete: NOBODY_CAN,
//          },
//       },
//       user: {
//          row: {
//             insert: NOBODY_CAN,
//             update: {
//                preMutation: NOBODY_CAN,
//             },
//             delete: NOBODY_CAN,
//          },
//       },
//       message: {
//          row: {
//             // anyone can insert
//             insert: ANYONE_CAN,
//             // only sender can edit their own messages
//             update: {
//                preMutation: [allowIfMessageSender],
//             },
//             // must be logged in to delete
//             delete: [allowIfLoggedIn],
//          },
//       },
//    }
// })

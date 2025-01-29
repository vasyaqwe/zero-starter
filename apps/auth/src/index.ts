import { issuer } from "@openauthjs/openauth"
import { CodeProvider } from "@openauthjs/openauth/provider/code"
import { GithubProvider } from "@openauthjs/openauth/provider/github"
import { CloudflareStorage } from "@openauthjs/openauth/storage/cloudflare"
import { CodeUI } from "@openauthjs/openauth/ui/code"
import { subjects } from "@project/api/auth/subjects"
import { and, eq } from "@project/db"
import { type Database, db } from "@project/db/client"
import { oauthAccount, user } from "@project/db/schema/user"
import { clientEnv } from "@project/env/client"
import type { ClientEnv } from "@project/env/types"
import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { logger } from "hono/logger"

type AuthEnv = {
   ENVIRONMENT: "production" | "development"
   GITHUB_CLIENT_ID: string
   GITHUB_CLIENT_SECRET: string
   DATABASE_URL: string
   KV: KVNamespace
}

const app = new Hono<{
   Variables: {
      db: Database
      env: {
         client: ClientEnv
         server: AuthEnv
      }
   }
   Bindings: AuthEnv
}>()
   .use(logger())
   .use(async (c, next) => {
      c.set("env", {
         client: clientEnv[c.env.ENVIRONMENT],
         server: c.env,
      })
      c.set("db", db(c))
      await next()
   })
   .all("*", async (c) =>
      issuer({
         storage: CloudflareStorage({
            namespace: c.var.env.server.KV,
         }),
         providers: {
            code: CodeProvider(
               CodeUI({
                  sendCode: async (email, code) => {
                     console.log(email, code)
                  },
               }),
            ),
            github: GithubProvider({
               clientID: c.var.env.server.GITHUB_CLIENT_ID,
               clientSecret: c.var.env.server.GITHUB_CLIENT_SECRET,
               scopes: ["user:email"],
            }),
         },
         subjects,
         async success(ctx, value) {
            try {
               if (value.provider === "code") {
                  const email = value.claims.email
                  if (!email)
                     throw new HTTPException(400, {
                        message: "email not found in claims",
                     })

                  let foundUser = await c.var.db.query.user.findFirst({
                     where: eq(user.email, email),
                     columns: {
                        id: true,
                        email: true,
                        name: true,
                        partner: true,
                        image: true,
                     },
                  })

                  if (!foundUser) {
                     const [createdUser] = await c.var.db
                        .insert(user)
                        .values({ email: email, name: "" })
                        .returning({
                           id: user.id,
                           email: user.email,
                           name: user.name,
                           partner: user.partner,
                           image: user.image,
                        })
                     if (!createdUser)
                        throw new HTTPException(500, {
                           message: "Failed to create user",
                        })

                     foundUser = createdUser
                  }

                  return ctx.subject("user", foundUser)
               }
               if (value.provider === "github") {
                  const res = await fetch("https://api.github.com/user", {
                     headers: {
                        Authorization: `Bearer ${value.tokenset.access}`,
                        "User-Agent": "hobby/1.0",
                     },
                  })
                  if (!res.ok)
                     throw new HTTPException(400, {
                        message: await res.text(),
                     })

                  const githubUserProfile = (await res.json()) as {
                     id: number
                     email: string | null
                     name?: string | undefined
                     avatar_url?: string | undefined
                     login: string
                     verified: boolean
                  }

                  const existingAccount =
                     await c.var.db.query.oauthAccount.findFirst({
                        where: and(
                           eq(oauthAccount.providerId, "github"),
                           eq(
                              oauthAccount.providerUserId,
                              githubUserProfile.id.toString(),
                           ),
                        ),
                        with: {
                           user: {
                              columns: {
                                 id: true,
                                 email: true,
                                 name: true,
                                 partner: true,
                                 image: true,
                              },
                           },
                        },
                     })

                  if (existingAccount)
                     return ctx.subject("user", existingAccount.user)

                  //  email can be null if user has made it private.
                  if (!githubUserProfile.email) {
                     const res = await fetch(
                        "https://api.github.com/user/emails",
                        {
                           headers: {
                              Authorization: `Bearer ${value.tokenset.access}`,
                              "User-Agent": "hobby/1.0",
                           },
                        },
                     )
                     if (!res.ok)
                        throw new HTTPException(400, {
                           message: await res.text(),
                        })

                     const emails = (await res.json()) as {
                        email: string
                        primary: boolean
                        verified: boolean
                        visibility: string
                     }[]

                     const primaryEmail = emails.find((email) => email.primary)

                     if (primaryEmail) {
                        githubUserProfile.email = primaryEmail.email
                        githubUserProfile.verified = primaryEmail.verified
                     } else if (emails.length > 0 && emails[0]?.email) {
                        githubUserProfile.email = emails[0].email
                        githubUserProfile.verified = emails[0].verified
                     }
                  }

                  const githubEmail = githubUserProfile.email

                  if (!githubEmail)
                     throw new HTTPException(400, {
                        message: "No email found in github user profile",
                     })

                  // If no existing account check if the a user with the email exists and link the account.
                  const result = await c.var.db.transaction(async (tx) => {
                     const [newUser] = await tx
                        .insert(user)
                        .values({
                           email: githubEmail,
                           name:
                              githubUserProfile.name ?? githubUserProfile.login,
                           image: githubUserProfile.avatar_url,
                        })
                        .returning({
                           id: user.id,
                           email: user.email,
                           name: user.name,
                           partner: user.partner,
                           image: user.image,
                        })

                     if (!newUser)
                        throw new HTTPException(500, {
                           message: "Failed to create user",
                        })

                     await tx.insert(oauthAccount).values({
                        providerId: "github",
                        providerUserId: githubUserProfile.id.toString(),
                        userId: newUser.id,
                     })

                     return { newUser }
                  })

                  return ctx.subject("user", result.newUser)
               }
               throw new HTTPException(400, {
                  message: "Invalid provider",
               })
            } catch (error) {
               const message =
                  error instanceof Error ? error.message : "Auth error"
               console.error(message)

               const newRedirectUrl = new URL(
                  `${c.var.env.client.WEB_DOMAIN}/login`,
               )

               newRedirectUrl.searchParams.append("error", "true")

               return c.redirect(newRedirectUrl.toString())
            }
         },
      }).fetch(c.req.raw, c.env, c.executionCtx),
   )

export default app

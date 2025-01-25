import { issuer } from "@openauthjs/openauth"
import { CodeProvider } from "@openauthjs/openauth/provider/code"
import { GithubProvider } from "@openauthjs/openauth/provider/github"
import { CloudflareStorage } from "@openauthjs/openauth/storage/cloudflare"
import { CodeUI } from "@openauthjs/openauth/ui/code"
import { subjects } from "@project/api/auth/subjects"
import { type Database, initDb } from "@project/db/client"
import { user } from "@project/db/schema/user"
import { Hono } from "hono"
import { env } from "hono/adapter"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

export const ALLOWED_ORIGINS = ["https://www.project.io", "https://project.io"]

type Env = {
   ENVIRONMENT: "production" | "development"
   WEB_DOMAIN: string
   SERVER_DOMAIN: string
   DATABASE_URL: string
   GITHUB_CLIENT_ID: string
   GITHUB_CLIENT_SECRET: string
   KV: KVNamespace
}

const app = new Hono<{
   Variables: {
      db: Database
   }
   Bindings: Env
}>()
   .use(logger())
   .use((c, next) => {
      c.set("db", initDb(c))

      const handler = cors({
         origin: [env(c).WEB_DOMAIN, env(c).SERVER_DOMAIN, ...ALLOWED_ORIGINS],
         credentials: true,
         maxAge: 600,
      })
      return handler(c, next)
   })
   .all("*", async (c) => {
      return issuer({
         storage: CloudflareStorage({
            namespace: c.env.KV,
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
               clientID: env(c).GITHUB_CLIENT_ID,
               clientSecret: env(c).GITHUB_CLIENT_SECRET,
               scopes: ["user:email"],
            }),
         },
         subjects,
         async success(ctx, value) {
            if (value.provider === "code") {
               const email = value.claims.email
               if (!email) throw new Error("email not found in claims")

               let foundUser = await c.var.db.query.user.findFirst({
                  where: (table, { eq }) => eq(table.email, email),
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
                     .values({ email: email, name: "test" })
                     .returning({
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        partner: user.partner,
                        image: user.image,
                     })
                  foundUser = createdUser
               }

               if (!foundUser) throw new Error("User not found")

               return ctx.subject("user", foundUser)
            }

            throw new Error("Invalid provider")
         },
      }).fetch(c.req.raw, c.env, c.executionCtx)
   })

export default app

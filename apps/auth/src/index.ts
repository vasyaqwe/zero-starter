import { issuer } from "@openauthjs/openauth"
import { CodeProvider } from "@openauthjs/openauth/provider/code"
import { GithubProvider } from "@openauthjs/openauth/provider/github"
import { MemoryStorage } from "@openauthjs/openauth/storage/memory"
import { createSubjects } from "@openauthjs/openauth/subject"
import { CodeUI } from "@openauthjs/openauth/ui/code"
import { type Database, initDb } from "@project/db/client"
import { user, userInsertSchema } from "@project/db/schema/user"
import { Hono } from "hono"
import { env } from "hono/adapter"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

export const ALLOWED_ORIGINS = ["https://www.project.io", "https://project.io"]

const subjects = createSubjects({
   user: userInsertSchema,
})

type Env = {
   ENVIRONMENT: "production" | "development"
   CLOUDFLARE_ACCOUNT_ID: string
   DATABASE_URL: string
   GITHUB_CLIENT_ID: string
   GITHUB_CLIENT_SECRET: string
   WEB_DOMAIN: string
   SERVER_DOMAIN: string
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
         storage: MemoryStorage(),
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
         allow: async () => {
            return true
         },
         subjects,
         async success(ctx, value) {
            console.log(value, "<<<<<<<<<<")
            if (value.provider === "code") {
               let foundUser = await c.var.db.query.user.findFirst({
                  where: (table, { eq }) =>
                     eq(table.email, value.claims.email!),
               })

               if (!foundUser) {
                  const [createdUser] = await c.var.db
                     .insert(user)
                     .values({ email: value.claims.email!, name: "test" })
                     .returning()
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

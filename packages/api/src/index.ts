import { handleError } from "@project/api/error/utils"
import { createRouter } from "@project/api/misc/utils"
import { authRoute } from "@project/api/user/auth/route"
import { initDb } from "@project/db/client"
import { env } from "hono/adapter"
import { cors } from "hono/cors"
import { csrf } from "hono/csrf"
import { logger } from "hono/logger"

export const ALLOWED_ORIGINS = ["https://www.project.io", "https://project.io"]

const app = createRouter()

app.use(logger())
   .use((c, next) => {
      c.set("db", initDb(c))

      const handler = cors({
         origin: [env(c).WEB_DOMAIN, ...ALLOWED_ORIGINS],
         credentials: true,
         maxAge: 600,
      })
      return handler(c, next)
   })
   .onError(handleError)

const apiRoutes = createRouter()
   .route("/auth", authRoute)
   .get("/hello", (c) => {
      return c.json({
         message: "Hello from Hono!",
      })
   })

const baseRoutes = createRouter().use((c, next) => {
   const handler = csrf({
      origin: [env(c).WEB_DOMAIN, ...ALLOWED_ORIGINS],
   })
   return handler(c, next)
})
// .route("/user", userRoute)

const routes = app.route("/v1", apiRoutes).route("/", baseRoutes)

type AppRoutes = typeof routes

export { app, type AppRoutes }

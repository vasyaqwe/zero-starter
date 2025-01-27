import { ALLOWED_ORIGINS } from "@project/api/constants"
import { handleError } from "@project/api/error/utils"
import { createRouter } from "@project/api/misc/utils"
import { authRoute } from "@project/api/user/auth/route"
import { initDb } from "@project/db/client"
import { env } from "hono/adapter"
import { cors } from "hono/cors"
import { csrf } from "hono/csrf"
import { logger } from "hono/logger"

const app = createRouter()

app.use(logger())
   .use(async (c, next) => {
      c.set("db", initDb(c))
      await next()
   })
   .use((c, next) => {
      const handler = cors({
         origin: [env(c).WEB_DOMAIN, ...ALLOWED_ORIGINS],
         credentials: true,
         maxAge: 600,
      })
      return handler(c, next)
   })
   .onError(handleError)

const base = createRouter().get("/health", (c) =>
   c.json({
      message: "Healthy",
   }),
)

const auth = createRouter()
   .use((c, next) => {
      const handler = csrf({
         origin: [env(c).WEB_DOMAIN, ...ALLOWED_ORIGINS],
      })
      return handler(c, next)
   })
   .route("/", authRoute)

const routes = app.route("/auth", auth).route("/", base)

type AppRoutes = typeof routes

export { app, type AppRoutes }

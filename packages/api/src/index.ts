import { ALLOWED_ORIGINS } from "@project/api/constants"
import { handleError } from "@project/api/error/utils"
import { createRouter } from "@project/api/misc/utils"
import { authRoute } from "@project/api/user/auth/route"
import { userRoute } from "@project/api/user/route"
import { db } from "@project/db/client"
import { clientEnv } from "@project/env/client"
import { cors } from "hono/cors"
import { csrf } from "hono/csrf"
import { logger } from "hono/logger"

const app = createRouter()

app.use(logger())
   .use(async (c, next) => {
      c.set("env", {
         client: clientEnv[c.env.ENVIRONMENT],
         server: c.env,
      })
      c.set("db", db(c))
      await next()
   })
   .use((c, next) => {
      const handler = cors({
         origin: [c.var.env.client.WEB_DOMAIN, ...ALLOWED_ORIGINS],
         credentials: true,
         maxAge: 600,
      })
      return handler(c, next)
   })
   .onError(handleError)

const base = createRouter()
   .get("/health", (c) =>
      c.json({
         message: "Healthy",
      }),
   )
   .route("/user", userRoute)

const auth = createRouter()
   .use((c, next) => {
      const handler = csrf({
         origin: [c.var.env.client.WEB_DOMAIN, ...ALLOWED_ORIGINS],
      })
      return handler(c, next)
   })
   .route("/", authRoute)

const routes = app.route("/auth", auth).route("/", base)

type AppRoutes = typeof routes

export { app, type AppRoutes }

import { createClient } from "@openauthjs/openauth/client"
import type { HonoEnv } from "@project/api/context"
import type { Context } from "hono"
import { env } from "hono/adapter"
import type { CookieOptions } from "hono/utils/cookie"

export const auth = (c: Context<HonoEnv>) =>
   createClient({
      clientID: "project",
      issuer: env(c).AUTH_DOMAIN,
   })

export const cookieOptions: CookieOptions = {
   httpOnly: true,
   sameSite: "lax",
   path: "/",
   maxAge: 34560000,
}

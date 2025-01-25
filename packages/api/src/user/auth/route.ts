import { createRouter, zValidator } from "@project/api/misc/utils"
import { auth, cookieOptions } from "@project/api/user/auth"
import { env } from "hono/adapter"
import { deleteCookie, setCookie } from "hono/cookie"
import { z } from "zod"

export const authRoute = createRouter()
   .get(
      "/callback",
      zValidator(
         "query",
         z.object({
            code: z.string(),
            next: z.string().optional(),
         }),
      ),
      async (c) => {
         const code = c.req.valid("query").code
         const next = c.req.valid("query").next
         const url = new URL(`${env(c).WEB_DOMAIN}/api/auth/callback`)
         // if (next) {
         //     url.searchParams.set('next', next)
         // }

         const exchanged = await auth.exchange(code, url.toString())

         if (exchanged.err) {
            console.error(exchanged.err)
            return c.json({ error: exchanged.err }, 400)
         }

         setCookie(c, "access_token", exchanged.tokens.access, cookieOptions)
         setCookie(c, "refresh_token", exchanged.tokens.refresh, cookieOptions)

         return c.redirect(next || `${env(c).WEB_DOMAIN}`)
      },
   )
   .post("/logout", async (c) => {
      deleteCookie(c, "access_token")
      deleteCookie(c, "refresh_token")

      return c.redirect(`${env(c).WEB_DOMAIN}`)
   })

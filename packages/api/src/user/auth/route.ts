import { createRouter, zValidator } from "@project/api/misc/utils"
import { auth } from "@project/api/user/auth"
import { cookieOptions } from "@project/api/user/auth/constants"
import { authMiddleware } from "@project/api/user/auth/middleware"
import { createJwt, handleAuthError } from "@project/api/user/auth/utils"
import { eq } from "@project/db"
import { user } from "@project/db/schema/user"
import { env } from "@project/env"
import { deleteCookie, setCookie } from "hono/cookie"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"

export const authRoute = createRouter()
   .get("/me", authMiddleware, async (c) => {
      const db = c.get("db")

      const [foundUser] = await db
         .select()
         .from(user)
         .where(eq(user.id, c.var.user.id))

      if (!foundUser) throw new HTTPException(401, { message: "Unauthorized" })

      const jwt = await createJwt({ c, userId: foundUser.id })

      return c.json({
         id: foundUser.id,
         email: foundUser.email,
         jwt,
      })
   })
   .get(
      "/callback",
      zValidator(
         "query",
         z.object({
            code: z.string(),
         }),
      ),
      async (c) => {
         const code = c.req.valid("query").code

         const exchanged = await auth(c).exchange(
            code,
            `${env(c).SERVER_DOMAIN}${c.req.path}`,
         )

         if (exchanged.err) throw new HTTPException(400, exchanged.err)

         setCookie(c, "access_token", exchanged.tokens.access, cookieOptions)
         setCookie(c, "refresh_token", exchanged.tokens.refresh, cookieOptions)

         return c.redirect(env(c).WEB_DOMAIN)
      },
   )
   .get(
      "/callback/github",
      zValidator(
         "query",
         z.object({
            code: z.string(),
            state: z.string().optional(),
         }),
      ),
      async (c) => {
         const code = c.req.valid("query").code

         const exchanged = await auth(c).exchange(
            code,
            `${env(c).SERVER_DOMAIN}${c.req.path}`,
         )

         if (exchanged.err) throw new HTTPException(400, exchanged.err)

         setCookie(c, "access_token", exchanged.tokens.access, cookieOptions)
         setCookie(c, "refresh_token", exchanged.tokens.refresh, cookieOptions)

         return c.redirect(env(c).WEB_DOMAIN)
      },
   )
   .post("/logout", async (c) => {
      deleteCookie(c, "access_token")
      deleteCookie(c, "refresh_token")

      return c.json({ status: "ok" })
   })
   .onError(handleAuthError)

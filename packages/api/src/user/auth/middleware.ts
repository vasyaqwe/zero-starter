import type { AuthedHonoEnv } from "@project/api/context"
import { auth, cookieOptions } from "@project/api/user/auth"
import { subjects } from "@project/api/user/auth/subjects"
import { getCookie, setCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"

export const authMiddleware = createMiddleware<AuthedHonoEnv>(
   async (c, next) => {
      const accessToken = getCookie(c, "access_token")
      const refreshToken = getCookie(c, "refresh_token")

      if (!accessToken)
         throw new HTTPException(401, {
            message: "Unauthorized",
         })

      const verified = await auth(c as never).verify(subjects, accessToken, {
         refresh: refreshToken,
      })

      if (verified.err) throw new HTTPException(401, verified.err)

      c.set("user", verified.subject.properties)

      if (verified.tokens) {
         setCookie(c, "access_token", verified.tokens.access, cookieOptions)
         setCookie(c, "refresh_token", verified.tokens.refresh, cookieOptions)
      }

      await next()
   },
)

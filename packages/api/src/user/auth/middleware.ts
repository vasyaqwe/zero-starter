import type { AuthedHonoEnv } from "@project/api/context"
import { auth } from "@project/api/user/auth"
import { cookieOptions } from "@project/api/user/auth/constants"
import { subjects } from "@project/api/user/auth/subjects"
import { eq } from "@project/db"
import { user } from "@project/db/schema/user"
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

      const [foundUser] = await c
         .get("db")
         .select()
         .from(user)
         .where(eq(user.id, verified.subject.properties.id))

      if (!foundUser) throw new HTTPException(401, { message: "Unauthorized" })

      c.set("user", foundUser)

      if (verified.tokens) {
         setCookie(c, "access_token", verified.tokens.access, cookieOptions)
         setCookie(c, "refresh_token", verified.tokens.refresh, cookieOptions)
      }

      await next()
   },
)

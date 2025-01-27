import type { AuthedHonoEnv } from "@project/api/context"
import { handleError } from "@project/api/error/utils"
import { env } from "@project/env"
import type { Context } from "hono"
import { SignJWT } from "jose"

export const createJwt = async ({
   c,
   userId,
}: { userId: string | undefined; c: Context<AuthedHonoEnv> }) => {
   const jwtPayload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
   }

   const jwt = await new SignJWT(jwtPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1w")
      .sign(new TextEncoder().encode(c.env.ZERO_AUTH_SECRET))

   return jwt
}

export const handleAuthError = (error: Error, c: Context) => {
   console.error(error.message)

   if (c.req.path === "/auth/me") return handleError(error, c)

   const newRedirectUrl = new URL(`${env(c).WEB_DOMAIN}/login`)

   newRedirectUrl.searchParams.append("error", "true")

   return c.redirect(newRedirectUrl.toString())
}

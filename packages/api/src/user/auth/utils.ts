import type { AuthedHonoEnv, HonoEnv } from "@project/api/context"
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
      .setExpirationTime("30days")
      .sign(new TextEncoder().encode(c.var.env.server.ZERO_AUTH_SECRET))

   return jwt
}

export const handleAuthError = (error: Error, c: Context<HonoEnv>) => {
   console.error(error.message)

   const newRedirectUrl = new URL(`${c.var.env.client.WEB_DOMAIN}/login`)

   newRedirectUrl.searchParams.append("error", "true")

   return c.redirect(newRedirectUrl.toString())
}

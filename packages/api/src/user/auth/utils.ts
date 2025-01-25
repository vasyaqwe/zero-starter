import type { AuthedHonoEnv } from "@project/api/context"
import type { Context } from "hono"
import { env } from "hono/adapter"
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
      .sign(new TextEncoder().encode(env(c).JWT_SECRET))

   return jwt
}

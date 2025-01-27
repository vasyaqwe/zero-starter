import type { CookieOptions } from "hono/utils/cookie"

export const cookieOptions: CookieOptions = {
   httpOnly: true,
   secure: true,
   sameSite: "lax",
   path: "/",
   maxAge: 34560000,
}

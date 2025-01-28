import type { CookieOptions } from "hono/utils/cookie"

export const cookieOptions = {
   path: "/",
   httpOnly: true,
   secure: true,
   sameSite: "lax",
   maxAge: 30 * 24 * 60 * 60, // 30 days
} satisfies CookieOptions

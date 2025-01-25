import { createClient } from "@openauthjs/openauth/client"
import type { CookieOptions } from "hono/utils/cookie"

export const auth = createClient({
   clientID: "project",
   issuer: "http://localhost:8080",
})

export const cookieOptions: CookieOptions = {
   httpOnly: true,
   sameSite: "lax",
   path: "/",
   maxAge: 34560000,
}

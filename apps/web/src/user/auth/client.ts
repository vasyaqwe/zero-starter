import { env } from "@/env"
import { createClient } from "@openauthjs/openauth/client"

export const auth = createClient({
   clientID: "project",
   issuer: env.AUTH_DOMAIN,
})

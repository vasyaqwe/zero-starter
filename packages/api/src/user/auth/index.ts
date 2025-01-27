import { createClient } from "@openauthjs/openauth/client"
import type { HonoEnv } from "@project/api/context"
import { env } from "@project/env"
import type { Context } from "hono"

export const auth = (c: Context<HonoEnv>) =>
   createClient({
      clientID: "project",
      issuer: env(c).AUTH_DOMAIN,
   })

import { createClient } from "@openauthjs/openauth/client"
import type { HonoEnv } from "@project/api/context"
import type { Context } from "hono"
import { env } from "hono/adapter"

export const auth = (c: Context<HonoEnv>) =>
   createClient({
      clientID: "project",
      issuer: env(c).AUTH_DOMAIN,
   })

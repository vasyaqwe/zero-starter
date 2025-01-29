import { createClient } from "@openauthjs/openauth/client"
import type { HonoEnv } from "@project/api/context"
import type { Context } from "hono"

export const auth = (c: Context<HonoEnv>) =>
   createClient({
      clientID: "project",
      issuer: c.var.env.client.AUTH_DOMAIN,
   })

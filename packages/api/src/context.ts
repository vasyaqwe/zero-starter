import type { Env } from "@project/api/env"
import type { Database } from "@project/db/client"

type Variables = {
   db: Database
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AuthVariables = { user: any; session: any }

export type HonoEnv = {
   Bindings: Env
   Variables: Variables
}

export type AuthedHonoEnv = {
   Variables: Variables & AuthVariables
}

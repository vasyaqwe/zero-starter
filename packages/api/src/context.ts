import type { Env } from "@project/api/env"

// biome-ignore lint/complexity/noBannedTypes: <explanation>
type Variables = {}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AuthVariables = { user: any; session: any }

export type HonoEnv = {
   Bindings: Env
   Variables: Variables
}

export type AuthedHonoEnv = {
   Variables: Variables & AuthVariables
}

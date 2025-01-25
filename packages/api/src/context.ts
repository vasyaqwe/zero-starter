import type { Env } from "@project/api/env"
import type { Database } from "@project/db/client"
import type { User } from "@project/db/schema/user"

type Variables = {
   db: Database
}

type AuthVariables = { user: User }

export type HonoEnv = {
   Bindings: Env
   Variables: Variables
}

export type AuthedHonoEnv = {
   Bindings: Env
   Variables: Variables & AuthVariables
}

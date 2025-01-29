import type { Database } from "@project/db/client"
import type { User } from "@project/db/schema/user"
import type { Env, ServerEnv } from "@project/env/types"

type Variables = {
   db: Database
   env: Env
}

type AuthVariables = Variables & { user: User }

export type HonoEnv = {
   Bindings: ServerEnv
   Variables: Variables
}

export type AuthedHonoEnv = {
   Bindings: ServerEnv
   Variables: AuthVariables
}

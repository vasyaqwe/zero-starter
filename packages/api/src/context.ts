import type { Database } from "@project/db/client"
import type { User } from "@project/db/schema/user"
import type { ClientEnv, ServerEnv } from "@project/env/types"

type Variables = {
   db: Database
   env: ClientEnv
}

type AuthVariables = { user: User }

export type HonoEnv = {
   Bindings: ServerEnv
   Variables: Variables
}

export type AuthedHonoEnv = {
   Bindings: ServerEnv
   Variables: Variables & AuthVariables
}

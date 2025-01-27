import type { Database } from "@project/db/client"
import type { User } from "@project/db/schema/user"
import type { ServerEnv } from "@project/env"

type Variables = {
   db: Database
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

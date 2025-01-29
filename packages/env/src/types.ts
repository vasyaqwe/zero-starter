import type { clientEnv } from "./client"

export type ServerEnv = {
   ENVIRONMENT: "production" | "development"
   DATABASE_URL: string
   ZERO_AUTH_SECRET: string
}

export type ClientEnv = (typeof clientEnv)["production" | "development"]

export type Env = ServerEnv & ClientEnv

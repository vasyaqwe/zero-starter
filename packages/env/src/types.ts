import type { clientEnv } from "./client"

type Environment = "production" | "development"

export type AuthEnv = {
   ENVIRONMENT: Environment
   GITHUB_CLIENT_ID: string
   GITHUB_CLIENT_SECRET: string
   DATABASE_URL: string
   KV: KVNamespace
}

export type ServerEnv = {
   ENVIRONMENT: Environment
   DATABASE_URL: string
   ZERO_AUTH_SECRET: string
}

export type ClientEnv = (typeof clientEnv)[Environment]

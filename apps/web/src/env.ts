import { env as baseEnv } from "@project/env"

export const env = baseEnv({
   env: { ENVIRONMENT: import.meta.env.MODE as "development" | "production" },
})

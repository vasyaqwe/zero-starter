import { clientEnv } from "@project/env/client"

export const env =
   clientEnv[import.meta.env.MODE as "development" | "production"]

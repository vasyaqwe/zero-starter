import { env } from "@/env"
import type { AppRoutes } from "@project/api"
import type { ErrorCode } from "@project/api/error/schema"
import { type ClientResponse, hc as honoClient } from "hono/client"
import type { StatusCode } from "hono/utils/http-status"

export const hc = honoClient<AppRoutes>(env.SERVER_DOMAIN, {
   init: {
      credentials: "include",
   },
})

type HonoResponse<T> = Promise<ClientResponse<T, StatusCode, "json">>

export const honoQueryFn = <T>(fn: () => HonoResponse<T>) => {
   return async () => {
      const res = await fn()
      if (res.ok) return res.json()
      return Promise.reject(await res.json())
   }
}

export const honoMutationFn = async <T>(
   res: ClientResponse<T, StatusCode, "json">,
) => {
   if (res.ok) return await res.json()
   return Promise.reject(await res.json())
}

export type HonoError = {
   code: ErrorCode
   message: string
}

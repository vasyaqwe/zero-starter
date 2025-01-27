import type { HonoError } from "@/lib/hono"
import useSWRBase, { type SWRConfiguration } from "swr"

export const useSWR = <T>(
   key: string,
   fetcher: (url: string) => Promise<T>,
   config?: SWRConfiguration,
) => useSWRBase<T, HonoError>(key, fetcher, config)

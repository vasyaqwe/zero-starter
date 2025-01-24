import type { QueryResult } from "@/lib/zero/types"
import type { Schema } from "@project/cache/schema"
import type { Query, Zero } from "@rocicorp/zero"
import {
   useZero as useZeroBase,
   useQuery as useZeroQuery,
} from "@rocicorp/zero/react"

export const useZero = useZeroBase<Schema>

export function useQuery<
   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
   QueryBuilder extends (z: Zero<Schema>["query"]) => Query<any, any>,
   Q extends ReturnType<QueryBuilder>,
>(
   createQuery: QueryBuilder,
   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
): Q extends Query<any, infer Return> ? QueryResult<Return> : never {
   const z = useZero()
   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
   return useZeroQuery(createQuery(z.query)) as any
}

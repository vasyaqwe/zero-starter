import type { QueryResult } from "@/lib/zero/types"
import type { Schema } from "@project/cache/schema"
import { schema } from "@project/cache/schema"
import { type Query, Zero } from "@rocicorp/zero"
import {
   useZero as useZeroBase,
   useQuery as useZeroQuery,
} from "@rocicorp/zero/react"
import { createEmitter } from "@vxrn/emitter"

const createZero = ({
   auth,
   userID = "anon",
}: { auth?: string; userID?: string } = {}) =>
   new Zero({
      userID,
      auth,
      server: "http://localhost:4848",
      schema,
      kvStore: "mem",
   })

export let zero = createZero()

const zeroEmitter = createEmitter<typeof zero>()
export const useZeroEmit = zeroEmitter.use

export const setZeroAuth = ({
   jwtToken,
   userID,
}: { jwtToken: string; userID: string }) => {
   zero = createZero({
      auth: jwtToken,
      userID,
   })
   zeroEmitter.emit(zero)
}

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

import { env } from "@/env"
import { useAuth } from "@/user/auth/hooks"
import { Zero } from "@project/sync"
import { useZero as useZeroBase } from "@project/sync/react"
import type { Schema } from "@project/sync/schema"
import { schema } from "@project/sync/schema"
import { createEmitter } from "@vxrn/emitter"
import * as React from "react"

const createZero = ({
   auth,
   userId = "anon",
}: { auth?: string; userId?: string } = {}) =>
   new Zero({
      userID: userId,
      auth,
      server: env.CACHE_DOMAIN,
      schema,
      kvStore: env.DEV ? "mem" : "idb",
   })

export let zero = createZero()

const zeroEmitter = createEmitter<typeof zero>()
export const useZeroEmit = zeroEmitter.use

export const setZeroAuth = ({
   jwt,
   userId,
}: { jwt: string; userId: string }) => {
   zero = createZero({
      auth: jwt,
      userId,
   })
   zeroEmitter.emit(zero)
}

export function usePassJWTToZero() {
   const { user } = useAuth()

   React.useEffect(() => {
      if (!user?.jwt) return

      setZeroAuth({
         jwt: user.jwt,
         userId: user.id,
      })
   }, [user])
}

export const useZero = useZeroBase<Schema>

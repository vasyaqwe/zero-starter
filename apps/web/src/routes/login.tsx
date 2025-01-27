import { hc } from "@/lib/hono"
import { contentReadyAtom } from "@/ui/store"
import { auth } from "@/user/auth/client"
import { createFileRoute } from "@tanstack/react-router"
import { useSetAtom } from "jotai"

export const Route = createFileRoute("/login")({
   component: RouteComponent,
})

function RouteComponent() {
   const setContentReady = useSetAtom(contentReadyAtom)
   setContentReady(true)

   return (
      <div>
         Hello "/login"!
         <button
            onMouseDown={async () => {
               const { url: authUrl } = await auth.authorize(
                  hc.auth.callback.$url().toString(),
                  "code",
               )

               window.location.href = authUrl
            }}
         >
            Login
         </button>
         <button
            onMouseDown={async () => {
               const { url: authUrl } = await auth.authorize(
                  hc.auth.callback.github.$url().toString(),
                  "code",
               )

               window.location.href = authUrl
            }}
         >
            Github Login
         </button>
      </div>
   )
}

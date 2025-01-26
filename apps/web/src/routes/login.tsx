import { hc } from "@/lib/hono"
import { auth } from "@/user/auth/client"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/login")({
   component: RouteComponent,
})

function RouteComponent() {
   return (
      <div>
         Hello "/login"!
         <button
            onMouseDown={async () => {
               const url = new URL(hc.v1.auth.callback.$url())
               // if (next) {
               //   url.searchParams.set('next', next)
               // }

               const { url: authUrl } = await auth.authorize(
                  url.toString(),
                  "code",
               )

               window.location.href = authUrl
            }}
         >
            Login
         </button>
         <button
            onMouseDown={async () => {
               const url = new URL(hc.v1.auth.callback.github.$url())
               const { url: authUrl } = await auth.authorize(
                  url.toString(),
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

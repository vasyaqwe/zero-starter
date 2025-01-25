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
               const url = new URL(`http://localhost:3000/api/auth/callback`)
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
      </div>
   )
}

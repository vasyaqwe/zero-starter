import { schema } from "@project/cache/schema"
import { Zero } from "@rocicorp/zero"
import { ZeroProvider } from "@rocicorp/zero/react"
import { Outlet, createRootRoute, useMatches } from "@tanstack/react-router"
import { decodeJwt } from "jose"
import Cookies from "js-cookie"
import { useTheme } from "next-themes"
import * as React from "react"

export const Route = createRootRoute({
   component: RootComponent,
})

const encodedJWT = Cookies.get("jwt")
const decodedJWT = encodedJWT && decodeJwt(encodedJWT)
const userID = decodedJWT?.sub ? (decodedJWT.sub as string) : "anon"

const z = new Zero({
   userID,
   auth: async () => encodedJWT,
   server: "http://localhost:4848",
   schema,
   kvStore: "mem",
})

function RootComponent() {
   const { resolvedTheme } = useTheme()
   React.useEffect(() => {
      if (resolvedTheme === "dark") {
         document
            .querySelector('meta[name="theme-color"]')
            ?.setAttribute("content", "#0a0a0b")
      } else {
         document
            .querySelector('meta[name="theme-color"]')
            ?.setAttribute("content", "#FFFFFF")
      }
   }, [resolvedTheme])

   return (
      <ZeroProvider zero={z}>
         <Meta>
            {/* <Toaster /> */}
            <Outlet />
         </Meta>
      </ZeroProvider>
   )
}

function Meta({ children }: { children: React.ReactNode }) {
   const matches = useMatches()
   const meta = matches.at(-1)?.meta?.find((meta) => meta?.title)

   React.useEffect(() => {
      document.title = [meta?.title ?? "Project"].filter(Boolean).join(" · ")
   }, [meta])

   return children
}

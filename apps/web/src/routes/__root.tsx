import { useZeroEmit, zero } from "@/lib/zero/hooks"
import { ZeroProvider } from "@rocicorp/zero/react"
import { Outlet, createRootRoute, useMatches } from "@tanstack/react-router"
import { useTheme } from "next-themes"
import * as React from "react"

export const Route = createRootRoute({
   component: RootComponent,
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

   const [zeroInstance, setZeroInstance] = React.useState(zero)
   useZeroEmit((next) => setZeroInstance(next))

   return (
      <ZeroProvider zero={zeroInstance}>
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

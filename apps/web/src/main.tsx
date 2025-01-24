// import "@project/ui/styles"
import {
   ErrorComponent,
   type ErrorComponentProps,
   Link,
   RouterProvider,
   createRouter as createTanStackRouter,
   rootRouteId,
   useMatch,
   useRouter,
} from "@tanstack/react-router"
import type * as TauriAPI from "@tauri-apps/api"
import { ThemeProvider } from "next-themes"
import * as React from "react"
import ReactDOM from "react-dom/client"
import { routeTree } from "./routeTree.gen"

const createRouter = () => {
   return createTanStackRouter({
      routeTree,
      context: {},
      defaultPreload: "intent",
      defaultPendingMs: 0,
      defaultPendingMinMs: 0,
      defaultNotFoundComponent: NotFound,
      defaultErrorComponent: CatchBoundary,
   })
}

function NotFound() {
   return (
      <div className="grid h-svh flex-1 place-items-center text-center">
         <div>
            <h1 className="mb-2 font-semibold text-xl">Not found</h1>
            <p className="mb-5 text-lg leading-snug opacity-70">
               This page does not exist — <br /> it may have been moved or
               deleted.
            </p>
            <Link to={"/"}>Back home</Link>
         </div>
      </div>
   )
}

function CatchBoundary({ error }: ErrorComponentProps) {
   const router = useRouter()
   const _isRoot = useMatch({
      strict: false,
      select: (state) => state.id === rootRouteId,
   })

   return (
      <div className="grid h-svh place-items-center text-center">
         {import.meta.env.DEV && (
            <div className="absolute top-0">
               <ErrorComponent error={error} />
            </div>
         )}

         <div>
            <h1 className="mb-2 font-semibold text-xl">An error occurred</h1>
            <p className="mb-5 text-lg leading-snug opacity-70">
               Please, try again.
            </p>
            <div className="flex items-center justify-center gap-2.5">
               <button
                  onClick={() => {
                     router.invalidate()
                  }}
               >
                  Try Again
               </button>
            </div>
         </div>
      </div>
   )
}

declare global {
   var __TAURI_INTERNALS__: typeof TauriAPI
}

declare module "@tanstack/react-router" {
   interface Register {
      router: ReturnType<typeof createRouter>
   }
}

// biome-ignore lint/style/noNonNullAssertion: ...
ReactDOM.createRoot(document.getElementById("app")!).render(
   <React.StrictMode>
      <ThemeProvider
         defaultTheme="light"
         attribute="class"
         enableSystem
         disableTransitionOnChange
      >
         <RouterProvider router={createRouter()} />
      </ThemeProvider>
   </React.StrictMode>,
)

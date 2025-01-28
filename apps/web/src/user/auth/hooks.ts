import { hc, honoQueryFn } from "@/lib/hono"
import { useSWR } from "@/lib/swr"
import { useNavigate } from "@tanstack/react-router"

export function useAuth() {
   const user = useSWR(
      hc.user.me.$url().toString(),
      honoQueryFn(() => hc.user.me.$get()),
      {
         shouldRetryOnError: false,
         revalidateOnFocus: false,
      },
   )

   const navigate = useNavigate()

   const logout = async () => {
      await hc.auth.logout.$post()
      user.mutate().then(() => navigate({ to: "/login" }))
   }

   return { ...user, user: user.data, logout }
}

// export function useAuthPassTokenToTauriEffect ()  {
//    if (!isTauri) return

//    React.useEffect(() => {
//      try {
//        onOpenUrl(([urlString]) => {
//          const url = new URL(urlString)

//          switch (url.host) {
//            case 'finish-auth': {
//              const token = url.searchParams.get('token')
//              const session = url.searchParams.get('session')

//              if (token && session) {
//                setAuthClientToken({
//                  token,
//                  session,
//                })
//              }

//              break
//            }
//          }
//        })
//      } catch (err) {
//        console.error(err)
//      }
//    }, [])
//  }

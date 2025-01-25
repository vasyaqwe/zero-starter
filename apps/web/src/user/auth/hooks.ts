// import { setZeroAuth } from "@/lib/zero/hooks"
// import * as React from "react"

// export function useAuthPassJWTSecretToZeroEffect() {
//    const { jwtToken, user } = useAuth()

//    React.useEffect(() => {
//       if (user && jwtToken) {
//          setZeroAuth({
//             jwtToken,
//             userID: user.id,
//          })
//       }
//    }, [user, jwtToken])
// }

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

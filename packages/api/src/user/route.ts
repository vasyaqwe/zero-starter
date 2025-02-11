import { createRouter } from "@project/api/misc/utils"
import { authMiddleware } from "@project/api/user/auth/middleware"
import { createJwt } from "@project/api/user/auth/utils"

export const userRoute = createRouter()
   .use(authMiddleware)
   .get("/me", async (c) => {
      const jwt = await createJwt({ c, userId: c.var.user.id })

      return c.json({
         ...c.var.user,
         jwt,
      })
   })

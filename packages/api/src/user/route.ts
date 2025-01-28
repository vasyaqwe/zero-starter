import { createRouter } from "@project/api/misc/utils"
import { authMiddleware } from "@project/api/user/auth/middleware"
import { createJwt } from "@project/api/user/auth/utils"
import { eq } from "@project/db"
import { user } from "@project/db/schema/user"
import { HTTPException } from "hono/http-exception"

export const userRoute = createRouter()
   .use(authMiddleware)
   .get("/me", async (c) => {
      const db = c.get("db")

      const [foundUser] = await db
         .select()
         .from(user)
         .where(eq(user.id, c.var.user.id))

      if (!foundUser) throw new HTTPException(401, { message: "Unauthorized" })

      const jwt = await createJwt({ c, userId: foundUser.id })

      return c.json({
         id: foundUser.id,
         email: foundUser.email,
         jwt,
      })
   })

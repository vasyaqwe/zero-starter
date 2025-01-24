import type { HonoEnv } from "@project/api/context"
import { parseZodErrorIssues } from "@project/api/error/utils"
import { Hono, type ValidationTargets } from "hono"
import { validator } from "hono/validator"
import { ZodError, type ZodSchema, type z } from "zod"

export const createRouter = () => new Hono<HonoEnv>()

export const zValidator = <
   T extends ZodSchema,
   Target extends keyof ValidationTargets,
>(
   target: Target,
   schema: T,
) =>
   validator(target, async (value, c) => {
      try {
         return (await schema.parseAsync(value)) as z.infer<T>
      } catch (error) {
         console.error(error)

         if (error instanceof ZodError) {
            return c.json(
               {
                  code: "BAD_REQUEST",
                  message: parseZodErrorIssues(error.issues),
               },
               400,
            )
         }

         return c.json(
            {
               code: "INTERNAL_SERVER_ERROR",
               message:
                  error instanceof Error
                     ? (error.message ?? "Unknown error")
                     : "Unknown error",
            },
            500,
         )
      }
   })

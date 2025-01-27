import type { HonoEnv } from "@project/api/context"
import { parseZodErrorIssues, statusToCode } from "@project/api/error/utils"
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
         if (error instanceof ZodError) {
            const message = parseZodErrorIssues(error.issues)
            console.error(400, message)
            return c.json(
               {
                  code: statusToCode(400),
                  message,
               },
               400,
            )
         }

         const message =
            error instanceof Error
               ? (error.message ?? "Unknown error")
               : "Unknown error"

         console.error(500, message)
         return c.json(
            {
               code: statusToCode(500),
               message,
            },
            500,
         )
      }
   })

import type { HonoEnv } from "@project/api/context"
import type { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import { ZodError, type ZodIssue } from "zod"
import type { ErrorCode } from "./schema"

export const statusToCode = (status: number): ErrorCode => {
   switch (status) {
      case 400:
         return "BAD_REQUEST"
      case 401:
         return "UNAUTHORIZED"
      case 403:
         return "FORBIDDEN"
      case 404:
         return "NOT_FOUND"
      case 405:
         return "METHOD_NOT_ALLOWED"
      case 409:
         return "METHOD_NOT_ALLOWED"
      case 422:
         return "UNPROCESSABLE_ENTITY"
      case 429:
         return "TOO_MANY_REQUESTS"
      case 500:
         return "INTERNAL_SERVER_ERROR"
      default:
         return "INTERNAL_SERVER_ERROR"
   }
}

export const codeToStatus = (code: ErrorCode) => {
   switch (code) {
      case "BAD_REQUEST":
         return 400
      case "UNAUTHORIZED":
         return 401
      case "FORBIDDEN":
         return 403
      case "NOT_FOUND":
         return 404
      case "METHOD_NOT_ALLOWED":
         return 405
      case "CONFLICT":
         return 409
      case "UNPROCESSABLE_ENTITY":
         return 422
      case "TOO_MANY_REQUESTS":
         return 429
      case "INTERNAL_SERVER_ERROR":
         return 500
      default:
         return 500
   }
}

// Props to cal.com: https://github.com/calcom/cal.com/blob/5d325495a9c30c5a9d89fc2adfa620b8fde9346e/packages/lib/server/getServerErrorFromUnknown.ts#L17
export const parseZodErrorIssues = (issues: ZodIssue[]): string => {
   return issues
      .map((i) =>
         i.code === "invalid_union"
            ? i.unionErrors
                 .map((ue) => parseZodErrorIssues(ue.issues))
                 .join("; ")
            : i.code === "unrecognized_keys"
              ? i.message
              : `${i.path.length ? `${i.code} in '${i.path}': ` : ""}${i.message}`,
      )
      .join("; ")
}

export const handleError = (error: Error, c: Context<HonoEnv>) => {
   // c.var.sentry.captureException(error)
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
   if (error instanceof HTTPException) {
      return c.json(
         {
            code: statusToCode(error.status),
            message: error.message,
         },
         error.status,
      )
   }
   return c.json(
      {
         code: "INTERNAL_SERVER_ERROR",
         message: error.message ?? "Unknown error",
      },
      500,
   )
}

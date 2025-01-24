import type { QueryType, Smash } from "@rocicorp/zero"

export type QueryResult<TReturn extends QueryType> = [
   Smash<TReturn>,
   {
      type: "unknown" | "complete"
   },
]

import { createSubjects } from "@openauthjs/openauth/subject"
import { userSelectSchema } from "@project/db/schema/user"

export const subjects = createSubjects({
   user: userSelectSchema,
})

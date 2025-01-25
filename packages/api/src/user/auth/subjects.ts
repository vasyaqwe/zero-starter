import { createSubjects } from "@openauthjs/openauth/subject"
import { userInsertSchema } from "@project/db/schema/user"

export const subjects = createSubjects({
   user: userInsertSchema,
})

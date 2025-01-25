import { createClient } from "@openauthjs/openauth/client"

export const auth = createClient({
   clientID: "project",
   issuer: "http://localhost:8080",
})

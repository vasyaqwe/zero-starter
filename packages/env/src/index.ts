const baseEnv = {
   development: {
      AUTH_DOMAIN: "http://localhost:8080",
      SERVER_DOMAIN: "http://localhost:8787",
      WEB_DOMAIN: "http://localhost:3000",
      CACHE_DOMAIN: "http://localhost:4848",
      CLOUDFLARE_ACCOUNT_ID: "bfef1e994f1aac7e7a42dc4ba75197a0",
   } satisfies ClientEnv,
   production: {
      AUTH_DOMAIN: "https://auth.project.com",
      SERVER_DOMAIN: "https://api.project.com",
      WEB_DOMAIN: "https://app.project.com",
      CACHE_DOMAIN: "https://cache.project.com",
      CLOUDFLARE_ACCOUNT_ID: "bfef1e994f1aac7e7a42dc4ba75197a0",
   } satisfies ClientEnv,
} as const

export const env = (c: {
   env: { ENVIRONMENT: "development" | "production" }
}) => baseEnv[c.env.ENVIRONMENT]

export type ServerEnv = {
   ENVIRONMENT: "production" | "development"
   DATABASE_URL: string
   ZERO_AUTH_SECRET: string
}

type ClientEnv = {
   SERVER_DOMAIN: string
   AUTH_DOMAIN: string
   WEB_DOMAIN: string
   CACHE_DOMAIN: string
   CLOUDFLARE_ACCOUNT_ID: string
}

export type Env = ServerEnv & ClientEnv

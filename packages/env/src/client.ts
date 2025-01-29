export const clientEnv = {
   development: {
      AUTH_DOMAIN: "http://localhost:8080",
      SERVER_DOMAIN: "http://localhost:8787",
      WEB_DOMAIN: "http://localhost:3000",
      CACHE_DOMAIN: "http://localhost:4848",
      CLOUDFLARE_ACCOUNT_ID: "bfef1e994f1aac7e7a42dc4ba75197a0",
   },
   production: {
      AUTH_DOMAIN: "https://auth.project.com",
      SERVER_DOMAIN: "https://api.project.com",
      WEB_DOMAIN: "https://app.project.com",
      CACHE_DOMAIN: "https://cache.project.com",
      CLOUDFLARE_ACCOUNT_ID: "bfef1e994f1aac7e7a42dc4ba75197a0",
   },
} as const

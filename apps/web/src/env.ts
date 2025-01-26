const envBase = {
   development: {
      SERVER_DOMAIN: "http://localhost:3000",
      CACHE_DOMAIN: "http://localhost:4848",
      AUTH_DOMAIN: "http://localhost:8080",
   },
   production: {
      SERVER_DOMAIN: "https://api.project.com",
      CACHE_DOMAIN: "https://cache.project.com",
      AUTH_DOMAIN: "https://auth.project.com",
   },
} as const

export const env = envBase[import.meta.env.MODE as "development" | "production"]

const envBase = {
   development: {
      SERVER_DOMAIN: "http://localhost:8787",
   },
   production: {
      SERVER_DOMAIN: "http://localhost:8787",
   },
} as const

export const env = envBase[import.meta.env.MODE as "development" | "production"]

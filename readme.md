Zero starter

# Environment vars
Copy .env.example into .env, then:
- apps/cache: New-Item -ItemType SymbolicLink -Path .env -Target ..\..\.env
- apps/auth: New-Item -ItemType SymbolicLink -Path .dev.vars -Target ..\..\.env
- apps/server: New-Item -ItemType SymbolicLink -Path .dev.vars -Target ..\..\.env
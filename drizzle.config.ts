import { defineConfig } from 'drizzle-kit'
import { env } from '@/data/env/server'

export default defineConfig({
    dbCredentials: {
        password: env.DB_PASSWORD,
        user: env.DB_USER,
        database: env.DB_DATABASE,
        host: env.DB_HOST,
        ssl: false,
    },
    out: './src/drizzle/migrations',
    schema: './src/drizzle/schema.ts',
    strict: true,
    verbose: true,
    dialect: 'postgresql',
})

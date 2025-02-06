import { env } from '@/data/env/server'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

export const db = drizzle({
    schema,
    connection: {
        password: env.DB_PASSWORD,
        user: env.DB_USER,
        database: env.DB_DATABASE,
        host: env.DB_HOST,
    },
})

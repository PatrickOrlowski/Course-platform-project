import { UserRole } from '@/drizzle/schema/user'

export {}

declare global {
    interface CustomJwtSessionClaims {
        dbId?: string
        role?: UserRole
    }

    interface UserPublicMetaData {
        dbId?: string
        role?: UserRole
    }
}

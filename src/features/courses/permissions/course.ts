import { UserRole } from '@/drizzle/schema/user'

export function canCreateCourses(user: { role: UserRole | undefined }) {
    return user.role === 'admin'
}

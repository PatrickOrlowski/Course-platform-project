import { UserRole } from '@/drizzle/schema/user'

export function canCreateCourses(user: { role: UserRole | undefined }) {
    return user.role === 'admin'
}
export function canDeleteCourses(user: { role: UserRole | undefined }) {
    return user.role === 'admin'
}
export function canUpdateCourses(user: { role: UserRole | undefined }) {
    return user.role === 'admin'
}

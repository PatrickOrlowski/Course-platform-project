import { UserRole } from '@/drizzle/schema/user'

export function canCreateCourseSections(user: { role: UserRole | undefined }) {
    return user.role === 'admin'
}
export function canDeleteCourseSections(user: { role: UserRole | undefined }) {
    return user.role === 'admin'
}
export function canUpdateCourseSections(user: { role: UserRole | undefined }) {
    return user.role === 'admin'
}

import { UserRole } from '@/drizzle/schema/user'
import { CourseSectionTable } from '@/drizzle/schema/courseSection'
import { eq } from 'drizzle-orm'

export function canCreateCourseSections(user: { role: UserRole | undefined }) {
    return user.role === 'admin'
}
export function canDeleteCourseSections(user: { role: UserRole | undefined }) {
    return user.role === 'admin'
}
export function canUpdateCourseSections(user: { role: UserRole | undefined }) {
    return user.role === 'admin'
}

export const wherePublicCourseSections = eq(CourseSectionTable.status, "public")
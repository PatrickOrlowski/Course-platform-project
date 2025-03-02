import { UserRole } from '@/drizzle/schema/user'

export function canCreateProducts(user: { role: UserRole | undefined }) {
    return user.role === 'admin'
}
export function canDeleteProducts(user: { role: UserRole | undefined }) {
    return user.role === 'admin'
}
export function canUpdateProducts(user: { role: UserRole | undefined }) {
    return user.role === 'admin'
}

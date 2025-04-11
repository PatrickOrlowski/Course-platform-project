import { UserRole } from '@/drizzle/schema/user'
import { eq } from 'drizzle-orm'
import { ProductTable } from '@/drizzle/schema/product'

export function canCreateProducts(user: { role: UserRole | undefined }) {
    return user.role === 'admin'
}
export function canDeleteProducts(user: { role: UserRole | undefined }) {
    return user.role === 'admin'
}
export function canUpdateProducts(user: { role: UserRole | undefined }) {
    return user.role === 'admin'
}

export const wherePublicProducts = eq(ProductTable.status, 'public')

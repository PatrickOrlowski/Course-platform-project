import { UserTable } from '@/drizzle/schema/user'
import { db } from '@/drizzle/db'
import { eq } from 'drizzle-orm'
import { revalidateUserCache } from '@/features/users/db/cache'

export async function insertUser(data: typeof UserTable.$inferInsert) {
    const [newUser] = await db
        .insert(UserTable)
        .values(data)
        .returning()
        .onConflictDoUpdate({
            target: [UserTable.clerkUserId],
            set: data,
        })

    if (newUser === null) {
        throw new Error('Failed to insert user')
    }

    newUser && revalidateUserCache(newUser.id)

    return newUser
}

export async function updateUser(
    { clerkUserId }: { clerkUserId: string },
    data: Partial<typeof UserTable.$inferInsert>
) {
    const [updatedUser] = await db
        .update(UserTable)
        .set(data)
        .where(eq(UserTable.clerkUserId, clerkUserId))
        .returning()

    if (updatedUser === null) {
        throw new Error('Failed to updated user')
    }

    updatedUser && revalidateUserCache(updatedUser.id)

    return updatedUser
}

export async function deleteUser({ clerkUserId }: { clerkUserId: string }) {
    const [deletedUser] = await db
        .update(UserTable)
        .set({
            deletedAt: new Date(),
        })
        .where(eq(UserTable.clerkUserId, clerkUserId))
        .returning()

    if (deletedUser === null) {
        throw new Error('Failed to deleted user')
    }

    deletedUser && revalidateUserCache(deletedUser.id)

    return deletedUser
}

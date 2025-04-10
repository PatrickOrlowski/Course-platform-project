import { db } from '@/drizzle/db'
import { UserCourseAccessTable } from '@/drizzle/schema/userCourseAccess'
import { revalidateUserCourseAccessCache } from '@/features/courses/db/cache/userCourseAccess'

export async function addUserCourseAccess(
    {
        userId,
        courseIds,
    }: {
        userId: string
        courseIds: string[]
    },
    trx: Omit<typeof db, '$client'> = db
) {
    const accesses = await trx
        .insert(UserCourseAccessTable)
        .values(
            courseIds.map((courseId) => ({
                userId,
                courseId,
            }))
        )
        .onConflictDoNothing()
        .returning()

    if (accesses.length === 0) {
        throw new Error('Error creating user course access')
    }

    accesses.forEach(revalidateUserCourseAccessCache)

    return accesses
}

import { CourseTable } from '@/drizzle/schema/course'
import { db } from '@/drizzle/db'
import { revalidateCourseCache } from '@/features/courses/db/cache/course'
import { eq } from 'drizzle-orm'

export async function insertCourseDB(data: typeof CourseTable.$inferInsert) {
    const [newCourse] = await db.insert(CourseTable).values(data).returning()

    if (!newCourse) {
        throw new Error('Error creating course')
    }

    revalidateCourseCache(newCourse.id)

    return newCourse
}

export async function updateCourseDB(
    id: string,
    data: typeof CourseTable.$inferInsert
) {
    const [updatingCourse] = await db
        .update(CourseTable)
        .set(data)
        .where(eq(CourseTable.id, id))
        .returning()

    if (!updatingCourse) {
        throw new Error('Error updating a course')
    }

    revalidateCourseCache(updatingCourse.id)

    return updatingCourse
}

export async function deleteCourseDB(id: string) {
    const [deletedCourse] = await db
        .delete(CourseTable)
        .where(eq(CourseTable.id, id))
        .returning()

    if (!deletedCourse) {
        throw new Error('Error deleting course')
    }

    revalidateCourseCache(deletedCourse.id)

    return deletedCourse
}

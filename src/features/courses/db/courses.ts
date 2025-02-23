import { CourseTable } from '@/drizzle/schema/course'
import { db } from '@/drizzle/db'
import { revalidateCourseCache } from '@/features/courses/db/cache'
import { eq } from 'drizzle-orm'

export async function insertCourseDB(data: typeof CourseTable.$inferInsert) {
    const [newCourse] = await db.insert(CourseTable).values(data).returning()

    if (!newCourse) {
        throw new Error('Error creating course')
    }

    revalidateCourseCache(newCourse.id)

    return newCourse
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

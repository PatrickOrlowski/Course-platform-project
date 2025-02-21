import { CourseTable } from '@/drizzle/schema/course'
import { db } from '@/drizzle/db'
import { revalidateCourseCache } from '@/features/courses/db/cache'

export async  function insertCourse(data: typeof CourseTable.$inferInsert){
    const [newCourse] = await db.insert(CourseTable).values(data).returning()

    if(!newCourse){
        throw new Error('Error creating course')
    }

    revalidateCourseCache(newCourse.id)

    return newCourse
}
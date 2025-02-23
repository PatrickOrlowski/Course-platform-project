'use server'

import { z } from 'zod'
import { courseSchema } from '@/features/courses/schemas/courses'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/services/clerk'
import { canCreateCourses, canDeleteCourses } from '@/features/courses/permissions/course'
import { deleteCourseDB, insertCourseDB } from '@/features/courses/db/courses'

export async function createCourse(unsafeData: z.infer<typeof courseSchema>) {
    const { success, data } = courseSchema.safeParse(unsafeData)

    if (!success || !canCreateCourses(await getCurrentUser())) {
        return {
            error: true,
            message: 'There was an error creating the course',
        }
    }

    const course = await insertCourseDB(data)

    redirect(`/admin/courses/${course.id}/edit`)
}

export async function deleteCourse(id:string) {

    if (!canDeleteCourses(await getCurrentUser())) {
        return {
            error: true,
            message: 'There was an error deleting the course',
        }
    }

    await deleteCourseDB(id)

    return {
        error: false,
        message: 'Course deleted successfully',
    }
}


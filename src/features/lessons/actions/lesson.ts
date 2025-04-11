'use server'

import { z } from 'zod'
import { getCurrentUser } from '@/services/clerk'
import { lessonSchema } from '@/features/lessons/schemas/lesson'
import {
    canCreateLessons,
    canDeleteLessons,
    canUpdateLessons,
} from '@/features/lessons/permissions/lessons'
import {
    deleteLessonDB,
    getNextCourseLessonOrder,
    insertLessonDB,
    updateLessonDB,
    updateLessonOrdersDB,
} from '@/features/lessons/db/lessons'

export async function createLesson(unsafeData: z.infer<typeof lessonSchema>) {
    const { success, data } = lessonSchema.safeParse(unsafeData)

    if (!success || !canCreateLessons(await getCurrentUser())) {
        return {
            error: true,
            message: 'There was an error creating your lesson',
        }
    }

    const order = await getNextCourseLessonOrder(data.sectionId)

    console.log({ ...data, order }, 'HALO')

    await insertLessonDB({ ...data, order })

    return { error: false, message: 'Successfully created your lesson' }
}

export async function updateLesson(
    id: string,
    unsafeData: z.infer<typeof lessonSchema>
) {
    const { success, data } = lessonSchema.safeParse(unsafeData)

    if (!success || !canUpdateLessons(await getCurrentUser())) {
        return {
            error: true,
            message: 'There was an error updating your lesson',
        }
    }

    await updateLessonDB(id, data)

    return { error: false, message: 'Successfully updated your lesson' }
}

export async function deleteLesson(id: string) {
    if (!canDeleteLessons(await getCurrentUser())) {
        return { error: true, message: 'Error deleting your lesson' }
    }

    await deleteLessonDB(id)

    return { error: false, message: 'Successfully deleted your lesson' }
}

export async function updateLessonOrders(lessonIds: string[]) {
    if (lessonIds.length === 0 || !canUpdateLessons(await getCurrentUser())) {
        return { error: true, message: 'Error reordering your lessons' }
    }

    await updateLessonOrdersDB(lessonIds)

    return { error: false, message: 'Successfully reordered your lessons' }
}

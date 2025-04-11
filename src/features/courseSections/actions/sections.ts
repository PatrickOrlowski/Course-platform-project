'use server'

import { z } from 'zod'
import { getCurrentUser } from '@/services/clerk'
import { sectionSchema } from '@/features/courseSections/schemas/sections'
import {
    canCreateCourseSections,
    canDeleteCourseSections,
    canUpdateCourseSections,
} from '@/features/courseSections/permissions/sections'
import {
    deleteSectionDB,
    getNextCourseSectionOrderDB,
    insertSectionDB,
    updateSectionDB,
    updateSectionOrdersDB,
} from '@/features/courseSections/db/section'

export async function createSection(
    courseId: string,
    unsafeData: z.infer<typeof sectionSchema>
) {
    const { success, data } = sectionSchema.safeParse(unsafeData)

    if (!success || !canCreateCourseSections(await getCurrentUser())) {
        return {
            error: true,
            message: 'There was an error creating the section',
        }
    }

    const order = await getNextCourseSectionOrderDB(courseId)

    await insertSectionDB({ ...data, courseId, order })

    return {
        error: false,
        message: 'Section created successfully',
    }
}
export async function updateSection(
    id: string,
    unsafeData: z.infer<typeof sectionSchema>
) {
    const { success, data } = sectionSchema.safeParse(unsafeData)

    if (!success || !canUpdateCourseSections(await getCurrentUser())) {
        return {
            error: true,
            message: 'There was an error updating your section',
        }
    }

    await updateSectionDB(id, data)

    return {
        error: false,
        message: 'Section updated successfully',
    }
}

export async function deleteSection(id: string) {
    if (!canDeleteCourseSections(await getCurrentUser())) {
        return {
            error: true,
            message: 'There was an error deleting the section',
        }
    }

    await deleteSectionDB(id)

    return {
        error: false,
        message: 'Section deleted successfully',
    }
}

export async function updateSectionOrders(sectionsIds: string[]) {
    if (
        sectionsIds.length === 0 ||
        !canUpdateCourseSections(await getCurrentUser())
    ) {
        return {
            error: true,
            message: 'There was an error updating the sections order',
        }
    }

    await updateSectionOrdersDB(sectionsIds)

    return {
        error: false,
        message: 'Sections order updated successfully',
    }
}

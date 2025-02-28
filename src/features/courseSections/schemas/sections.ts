import { z } from 'zod'
import { courseSectionStatuses } from '@/drizzle/schema/courseSection'

export const sectionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    status: z.enum(courseSectionStatuses),
})
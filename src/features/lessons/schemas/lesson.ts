import { z } from 'zod'
import { lessonStatusEnum } from '@/drizzle/schema/lesson'

export const lessonSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    sectionId: z.string().min(1, 'Required'),
    status: z.enum(lessonStatusEnum.enumValues),
    youtubeVideoId: z.string().min(1, 'YouTube video is required'),
    description: z
        .string()
        .transform((v) => (v === '' ? null : v))
        .nullable(),
})

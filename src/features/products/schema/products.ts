import { z } from 'zod'
import { productStatuses } from '@/drizzle/schema/product'

export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    priceInDollars: z.number().nonnegative("Price must be a positive number"),
    description: z.string().min(1, "Description is required"),
    imageUrl: z.union([
        z.string().url("Image URL must be a valid URL"),
        z.string().startsWith("/", "Image URL must be a valid URL"),
    ]),
    status: z.enum(productStatuses),
    courseIds: z.array(z.string()).min(1, "At least one course is required"),
})
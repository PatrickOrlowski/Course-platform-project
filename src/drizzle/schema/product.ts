import { integer, pgEnum, pgTable, text } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createdAt, id, updatedAt } from '@/drizzle/schemaHelpers'
import { CourseProductTable } from '@/drizzle/schema/courseProduct'

export const productStatuses = ['public', 'private'] as const
export type ProductStatus = (typeof productStatuses)[number]
export const productStatusEnum = pgEnum('product_status', productStatuses)

export const ProductTable = pgTable('products', {
    id,
    name: text().notNull(),
    description: text().notNull(),
    imageUrl: text().notNull(),
    priceInDollars: integer().notNull(),
    status: productStatusEnum().notNull().default('private'),
    createdAt,
    updateAt: updatedAt,
})

export const ProductRelationships = relations(ProductTable, ({ many }) => ({
    courseProducts: many(CourseProductTable),
}))

import { db } from '@/drizzle/db'
import { eq } from 'drizzle-orm'
import { ProductTable } from '@/drizzle/schema/product'
import { revalidateProductCache } from '@/features/products/db/cache'
import { CourseProductTable } from '@/drizzle/schema/courseProduct'

export async function insertProductDB(
    data: typeof ProductTable.$inferInsert & { courseIds: string[] }
) {
    const newProduct = await db.transaction(async (trx) => {
        const [newProduct] = await trx
            .insert(ProductTable)
            .values(data)
            .returning()

        if (!newProduct) {
            trx.rollback()
            throw new Error('Error creating product')
        }

        await trx.insert(CourseProductTable).values(data.courseIds.map(courseId=>({
            productId: newProduct.id,
            courseId
        })))

        return newProduct
    })

    if (!newProduct) {
        throw new Error('Error creating product')
    }

    revalidateProductCache(newProduct.id)

    return newProduct
}

export async function updateProductDB(
    id: string,
    data: Partial<typeof ProductTable.$inferInsert> & { courseIds: string[] }
) {
    const updatingProduct = await db.transaction(async (trx) => {
        const [updateProduct] = await trx
            .update(ProductTable)
            .set(data)
            .where(eq(ProductTable.id, id))
            .returning()

        if (!updateProduct) {
            trx.rollback()
            throw new Error('Error update product')
        }

        await trx.delete(CourseProductTable).where(eq(CourseProductTable.productId, updateProduct.id))

        await trx.insert(CourseProductTable).values(data.courseIds.map(courseId=>({
            productId: updateProduct.id,
            courseId
        })))

        return updateProduct
    })

    if (!updatingProduct) {
        throw new Error('Error creating product')
    }

    revalidateProductCache(updatingProduct.id)

    return updatingProduct
}

export async function deleteProductDB(id: string) {
    const [deletedProduct] = await db
        .delete(ProductTable)
        .where(eq(ProductTable.id, id))
        .returning()

    if (!deletedProduct) {
        throw new Error('Error deleting product')
    }

    revalidateProductCache(deletedProduct.id)

    return deletedProduct
}

'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/services/clerk'
import { canCreateProducts, canDeleteProducts, canUpdateProducts } from '../permissions/products'
import { productSchema } from '@/features/products/schema/products'
import { deleteProductDB, insertProductDB, updateProductDB } from '@/features/products/db/products'

export async function createProduct(unsafeData: z.infer<typeof productSchema>) {
    const { success, data } = productSchema.safeParse(unsafeData)

    if (!success || !canCreateProducts(await getCurrentUser())) {
        return {
            error: true,
            message: 'There was an error creating the product',
        }
    }

    const product = await insertProductDB(data)

    redirect(`/admin/products/${product.id}/edit`)
}
export async function updateProduct(
    id: string,
    unsafeData: z.infer<typeof productSchema>
) {
    const { success, data } = productSchema.safeParse(unsafeData)

    if (!success || !canUpdateProducts(await getCurrentUser())) {
        return {
            error: true,
            message: 'There was an error updating your product',
        }
    }

    await updateProductDB(id, data)

    redirect(`/admin/products`)
}

export async function deleteProduct(id: string) {
    if (!canDeleteProducts(await getCurrentUser())) {
        return {
            error: true,
            message: 'There was an error deleting the product',
        }
    }

    await deleteProductDB(id)

    return {
        error: false,
        message: 'Product deleted successfully',
    }
}

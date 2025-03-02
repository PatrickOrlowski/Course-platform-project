import React from 'react'
import PageHeader from '@/components/PageHeader'
import ProductForm from '@/features/products/components/ProductForm'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { getCourseGlobalTag } from '@/features/courses/db/cache/course'
import { db } from '@/drizzle/db'
import { asc, eq } from 'drizzle-orm'
import { CourseTable } from '@/drizzle/schema/course'
import { notFound } from 'next/navigation'
import { getProductIdTag } from '@/features/products/db/cache'
import { ProductTable } from '@/drizzle/schema/product'

const EditProductPage = async ({
    params,
}: {
    params: Promise<{ productId: string }>
}) => {
    const { productId } = await params

    const product = await getProduct(productId)

    if (!product) notFound()

    return (
        <div className={'container my-6'}>
            <PageHeader title={'New Product'} />
            <ProductForm
                product={{
                    ...product,
                    courseIds: product.courseProducts.map((cp) => cp.courseId),
                }}
                courses={await getCourses()}
            />
        </div>
    )
}

async function getProduct(productId: string) {
    'use cache'
    cacheTag(getProductIdTag(productId))

    return db.query.ProductTable.findFirst({
        where: eq(ProductTable.id, productId),
        columns: {
            id: true,
            name: true,
            status: true,
            priceInDollars: true,
            description: true,
            imageUrl: true,
        },
        with: {
            courseProducts: {
                columns: {
                    courseId: true,
                },
            },
        },
    })
}

async function getCourses() {
    'use cache'
    cacheTag(getCourseGlobalTag())

    return db.query.CourseTable.findMany({
        columns: {
            id: true,
            name: true,
        },
        orderBy: asc(CourseTable.name),
    })
}

export default EditProductPage

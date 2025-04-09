import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { getProductGlobalTag } from '@/features/products/db/cache'
import { db } from '@/drizzle/db'
import { wherePublicProducts } from '@/features/products/permissions/products'
import { asc } from 'drizzle-orm'
import { ProductTable } from '@/drizzle/schema/product'
import { ProductCard } from '@/features/products/components/ProductCard'

export default async function HomePage() {
    const products = await getPublicProducts()

    return (
        <div className={'container my-6'}>
            <div
                className={
                    'grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4'
                }
            >
                {products.map((product) => (
                    <ProductCard {...product} key={product.id} />
                ))}
            </div>
        </div>
    )
}

async function getPublicProducts() {
    'use cache'
    cacheTag(getProductGlobalTag())

    return db.query.ProductTable.findMany({
        columns: {
            id: true,
            name: true,
            priceInDollars: true,
            imageUrl: true,
            description: true,
        },
        where: wherePublicProducts,
        orderBy: asc(ProductTable.name),
    })
}

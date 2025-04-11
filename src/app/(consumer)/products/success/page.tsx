import { db } from '@/drizzle/db'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { getProductIdTag } from '@/features/products/db/cache'
import { and, eq } from 'drizzle-orm'
import { ProductTable } from '@/drizzle/schema/product'
import { wherePublicProducts } from '@/features/products/permissions/products'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ProductPurchaseSuccessPage({
    params,
}: {
    params: Promise<{ productId: string }>
}) {
    const { productId } = await params
    const product = await getPublicProduct(productId)

    if (!product) notFound()

    return (
        <div className={'content mt-6 '}>
            <div className={'flex items-center justify-between gap-16'}>
                <div className={'flex flex-col gap-4 items-start'}>
                    <h1 className={'text-3xl font-semibold'}>
                        Purchase successful
                    </h1>
                    <p className={'text-xl text-muted-foreground'}>
                        Thank you for your purchase!
                    </p>
                    <p className={'text-xl text-muted-foreground'}>
                        You can now access the product: {product.name}
                    </p>
                    <Button
                        asChild={true}
                        className={'text-xl h-auto py-4 py-8 rounded-lg'}
                    >
                        <Link href={`/courses`}>View my courses</Link>
                    </Button>
                    <div className={'relative aspect-video max-w-lg flex-glow'}>
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className={'object-contain rounded-xl'}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

async function getPublicProduct(productId: string) {
    'use cache'
    cacheTag(getProductIdTag(productId))

    return db.query.ProductTable.findFirst({
        where: and(eq(ProductTable.id, productId), wherePublicProducts),
        columns: {
            name: true,
            imageUrl: true,
        },
    })
}

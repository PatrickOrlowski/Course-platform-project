import React, { Suspense } from 'react'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { getProductIdTag } from '@/features/products/db/cache'
import { db } from '@/drizzle/db'
import { and, eq } from 'drizzle-orm'
import { ProductTable } from '@/drizzle/schema/product'
import { wherePublicProducts } from '@/features/products/permissions/products'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/services/clerk'
import { userOwnsProduct } from '@/features/products/db/products'
import PageHeader from '@/components/PageHeader'
import { SignIn, SignUp } from '@clerk/nextjs'
import { StripeCheckoutForm } from '@/services/stripe/components/StripeCheckoutForm'

export default async function PurchasePage({
    params,
    searchParams,
}: {
    params: Promise<{ productId: string }>
    searchParams: Promise<{ authMode: string }>
}) {
    const { productId } = await params

    return (
        <Suspense
            fallback={<LoadingSpinner className={'my-6 size-36 mx-auto'} />}
        >
            <SuspendedComponent params={params} searchParams={searchParams} />
        </Suspense>
    )
}

async function SuspendedComponent({
    params,
    searchParams,
}: {
    params: Promise<{ productId: string }>
    searchParams: Promise<{ authMode: string }>
}) {
    const { productId } = await params
    const product = await getPublicProduct(productId)
    const { authMode } = await searchParams
    const { user } = await getCurrentUser({ allData: true })

    if (!product) return notFound()
    if (user) {
        if (await userOwnsProduct({ userId: user.id, productId })) {
            redirect('/courses')
        }

        return (
            <div className={'container my-6'}>
                <StripeCheckoutForm product={product} user={user} />
            </div>
        )
    }

    const isSignUp = authMode === 'signUp'

    return (
        <div className={'container my-6 flex flex-col items-center'}>
            <PageHeader title={'You need an account to make a purchase'} />
            {isSignUp ? (
                <SignUp
                    routing={'hash'}
                    signInUrl={`/products/${productId}/purchase?authMode=signIn`}
                    forceRedirectUrl={`/products/${productId}/purchase`}
                />
            ) : (
                <SignIn
                    routing={'hash'}
                    signUpUrl={`/products/${productId}/purchase?authMode=signUn`}
                    forceRedirectUrl={`/products/${productId}/purchase`}
                />
            )}
        </div>
    )
}

async function getPublicProduct(productId: string) {
    'use cache'
    cacheTag(getProductIdTag(productId))

    return db.query.ProductTable.findFirst({
        columns: {
            name: true,
            id: true,
            imageUrl: true,
            description: true,
            priceInDollars: true,
        },
        where: and(eq(ProductTable.id, productId), wherePublicProducts),
    })
}

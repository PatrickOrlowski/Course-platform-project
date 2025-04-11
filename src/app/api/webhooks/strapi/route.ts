import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'
import { stripeServerClient } from '@/services/stripe/stripeServer'
import Stripe from 'stripe'
import { db } from '@/drizzle/db'
import { eq } from 'drizzle-orm'
import { UserTable } from '@/drizzle/schema/user'
import { ProductTable } from '@/drizzle/schema/product'
import { addUserCourseAccess } from '@/features/courses/db/userCourseAccess'
import { insertPurchase } from '@/features/purchases/db/purchases'
import { env } from '@/data/env/server'

export async function GET(request: NextRequest) {
    const stripeSessionId = request.nextUrl.searchParams.get('stripeSessionId')
    if (!stripeSessionId) {
        redirect('/products/purchase-failure')
    }

    let redirectUrl: string

    try {
        const checkoutSession =
            await stripeServerClient.checkout.sessions.retrieve(
                stripeSessionId,
                {
                    expand: ['line_items', 'customer'],
                }
            )

        const productId = await processStripeCheckout(checkoutSession)
        redirectUrl = `/products/${productId}/purchase/success`
    } catch (error) {
        console.log('Error processing Stripe checkout:', error)
        redirectUrl = '/products/purchase-failure'
    }

    return NextResponse.redirect(new URL(redirectUrl, request.url))
}

export async function POST(request: NextRequest) {
    const event = await stripeServerClient.webhooks.constructEvent(
        await request.text(),
        request.headers.get('stripe-signature') as string,
        env.STRIPE_WEBHOOK_SECRET
    )

    switch (event.type) {
        case 'checkout.session.completed':
        case 'checkout.session.async_payment_succeeded': {
            try {
                await processStripeCheckout(event.data.object)
            } catch {
                return new Response(null, { status: 500 })
            }
        }
    }
    return new Response(null, { status: 200 })
}

async function processStripeCheckout(checkoutSession: Stripe.Checkout.Session) {
    const userId = checkoutSession.metadata?.userId
    const productId = checkoutSession.metadata?.productId

    if (!userId || !productId) {
        throw new Error('Missing metadata')
    }

    const [product, user] = await Promise.all([
        getProduct(productId),
        getUser(userId),
    ])

    if (!product) {
        throw new Error('Product not found')
    }

    if (!user) {
        throw new Error('User not found')
    }

    const courseIds = product.courseProducts.map(
        (courseProduct) => courseProduct.courseId
    )

    await db.transaction(async (trx) => {
        try {
            await addUserCourseAccess(
                {
                    userId: user.id,
                    courseIds,
                },
                trx
            )
            await insertPurchase(
                {
                    userId: user.id,
                    productDetails: product,
                    stripeSessionId: checkoutSession.id,
                    pricePaidInCents:
                        checkoutSession.amount_total ||
                        product.priceInDollars * 100,
                    productId: productId,
                },
                trx
            )
        } catch (e) {
            trx.rollback()
            console.error('Error processing purchase:', e)
            throw new Error('Error processing purchase')
        }
    })

    return productId
}

function getProduct(productId: string) {
    return db.query.ProductTable.findFirst({
        columns: {
            id: true,
            name: true,
            priceInDollars: true,
            imageUrl: true,
            description: true,
        },
        where: eq(ProductTable.id, productId),
        with: {
            courseProducts: {
                columns: {
                    courseId: true,
                },
                // with: {
                //     course: {
                //         columns: {
                //             id: true,
                //             name: true,
                //         },
                //     },
                // }
            },
        },
    })
}

function getUser(userId: string) {
    return db.query.UserTable.findFirst({
        columns: {
            id: true,
        },
        where: eq(UserTable.id, userId),
    })
}

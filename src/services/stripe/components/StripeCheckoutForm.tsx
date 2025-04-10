'use client'

import {
    EmbeddedCheckout,
    EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { stripeClientPromise } from '@/services/stripe/stripeClient'
import { getClientSessionSecret } from '@/services/stripe/actions/stripe'

export function StripeCheckoutForm({
    product,
    user,
}: {
    product: {
        priceInDollars: number
        name: string
        id: string
        description: string
        imageUrl: string
    }
    user: {
        email: string
        id: string
    }
}) {
    return (
        <EmbeddedCheckoutProvider
            stripe={stripeClientPromise}
            options={{
                fetchClientSecret: getClientSessionSecret.bind(
                    null,
                    product,
                    user
                ),
            }}
        >
            <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
    )
}

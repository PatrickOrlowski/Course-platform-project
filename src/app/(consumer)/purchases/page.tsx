import PageHeader from '@/components/PageHeader'
import { Suspense } from 'react'
import { getCurrentUser } from '@/services/clerk'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { getPurchaseUserTag } from '@/features/purchases/db/cache'
import { db } from '@/drizzle/db'
import { desc, eq } from 'drizzle-orm'
import { PurchaseTable } from '@/drizzle/schema/purchase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
    UserPurchaseTable,
    UserPurchaseTableSkeleton,
} from '@/features/purchases/components/UserPurchaseTable'

export default function PurchasesPage() {
    return (
        <div className={'cointainer my-6 '}>
            <PageHeader title={'Purchases History'}>
                <Suspense fallback={<UserPurchaseTableSkeleton />}>
                    <SuspenseBoundary />
                </Suspense>
            </PageHeader>
        </div>
    )
}

async function SuspenseBoundary() {
    const { userId, redirectToSignIn } = await getCurrentUser()

    if (!userId) {
        return redirectToSignIn()
    }

    const purchases = await getPurchases(userId)

    if (purchases.length === 0) {
        return (
            <div
                className={
                    'text-center text-gray-500 flex flex-col gap-2 items-start'
                }
            >
                No purchases found
                <Button asChild={true} size={'lg'}>
                    <Link href={'/'}>Browse Courses</Link>
                </Button>
            </div>
        )
    }

    return <UserPurchaseTable purchases={purchases} />
}

function getPurchases(userId: string) {
    'use cache'
    cacheTag(getPurchaseUserTag(userId))

    return db.query.PurchaseTable.findMany({
        columns: {
            id: true,
            pricePaidInCents: true,
            refundedAt: true,
            productDetails: true,
            createdAt: true,
            updatedAt: true,
        },
        where: eq(PurchaseTable.userId, userId),
        orderBy: desc(PurchaseTable.createdAt),
    })
}

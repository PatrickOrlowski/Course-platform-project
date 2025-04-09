import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { getProductIdTag } from '@/features/products/db/cache'
import { db } from '@/drizzle/db'
import { and, asc, eq } from 'drizzle-orm'
import { ProductTable } from '@/drizzle/schema/product'
import { wherePublicCourseSections } from '@/features/courseSections/permissions/sections'
import { wherePublicProducts } from '@/features/products/permissions/products'
import { CourseSectionTable } from '@/drizzle/schema/courseSection'
import { wherePublicLessons } from '@/features/lessons/permissions/lessons'
import { LessonTable } from '@/drizzle/schema/lesson'
import { getLessonCourseTag } from '@/features/lessons/db/cache/lessons'
import { getCourseSectionCourseTag } from '@/features/courseSections/db/cache'
import { getCourseIdTag } from '@/features/courses/db/cache/course'
import { formatPlural, formatPrice } from '@/lib/formatters'
import { getUserCoupon } from '@/lib/userCountryHeader'
import { getCurrentUser } from '@/services/clerk'
import { userOwnsProduct } from '@/features/products/db/products'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SkeletonButton } from '@/components/Skeletons'
import Image from 'next/image'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { VideoIcon } from 'lucide-react'

export default async function ProductPage({
    params,
}: {
    params: Promise<{ productId: string }>
}) {
    const { productId } = await params
    const product = await getPublicProduct(productId)

    if (!product) return notFound()

    const courseCount = product.courses.length
    const lessonCount = product.courses.reduce((acc, course) => {
        return (
            acc +
            course.courseSections.reduce((acc, section) => {
                return acc + section.lessons.length
            }, 0)
        )
    }, 0)

    return (
        <div className={'container my-6'}>
            <div className={'flex gap-16 items-center justify-between'}>
                <div className={'flex gap-6 flex-col items-start'}>
                    <div className={'flex flex-col gap-2'}>
                        <Suspense
                            fallback={
                                <div className={'text-xl '}>
                                    {formatPrice(product.priceInDollars)}
                                </div>
                            }
                        >
                            <Price price={product.priceInDollars} />
                        </Suspense>
                        <h1 className={'text-4xl font-semibold'}>
                            {product.name}
                        </h1>
                        <div className={'text-muted-foreground'}>
                            {formatPlural(courseCount, {
                                plural: 'courses',
                                singular: 'course',
                            })}{' '}
                            •{' '}
                            {formatPlural(lessonCount, {
                                plural: 'lessons',
                                singular: 'lesson',
                            })}
                        </div>
                    </div>
                    <div className={'text-xl '}>{product.description}</div>
                    <Suspense
                        fallback={<SkeletonButton className={'h-12 w-36'} />}
                    >
                        <PurchaseButton productId={product.id} />
                    </Suspense>
                </div>
                <div className={'relative aspect-video max-w-lg flex-grow'}>
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className={'object-contain rounded-xl'}
                    />
                </div>
            </div>
            <div
                className={
                    'grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 items-start'
                }
            >
                {product.courses.map((course) => (
                    <Card key={course.id} className={'flex flex-col gap-4'}>
                        <CardHeader>
                            <CardTitle>{course.name}</CardTitle>
                            <CardDescription>
                                {formatPlural(course.courseSections.length, {
                                    plural: 'Sections',
                                    singular: 'Section',
                                })}{' '}
                                •{' '}
                                {formatPlural(
                                    course.courseSections.reduce(
                                        (acc, section) => {
                                            return acc + section.lessons.length
                                        },
                                        0
                                    ),
                                    {
                                        plural: 'Lessons',
                                        singular: 'Lesson',
                                    }
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type={'multiple'}>
                                {course.courseSections.map((section) => (
                                    <AccordionItem
                                        key={section.id}
                                        value={section.id}
                                    >
                                        <AccordionTrigger
                                            className={'flex gap-2'}
                                        >
                                            <div
                                                className={
                                                    'flex flex-col flex-grow'
                                                }
                                            >
                                                <span className={'text-lg'}>
                                                    {section.name}
                                                </span>
                                                <span
                                                    className={
                                                        'text-muted-foreground'
                                                    }
                                                >
                                                    {formatPlural(
                                                        section.lessons.length,
                                                        {
                                                            plural: 'Lessons',
                                                            singular: 'Lesson',
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent
                                            className={'flex flex-col gap-2'}
                                        >
                                            {section.lessons.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    className={
                                                        'flex items-center gap-2 text-base'
                                                    }
                                                >
                                                    <VideoIcon
                                                        className={'size-4'}
                                                    />
                                                    {lesson.status ===
                                                    'preview' ? (
                                                        <Link
                                                            href={`/courses/${course.id}/lessons/${lesson.id}`}
                                                            className={'underline text-accent'}
                                                        >
                                                            {lesson.name}
                                                        </Link>
                                                    ) : (
                                                        lesson.name
                                                    )}
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

async function PurchaseButton({ productId }: { productId: string }) {
    const { userId } = await getCurrentUser()
    const alreadyPurchased =
        userId && (await userOwnsProduct({ userId, productId }))

    if (alreadyPurchased) {
        return (
            <div className={'text-xl text-foreground'}>
                You already own this product
            </div>
        )
    } else {
        return (
            <Button
                className={'text-xl h-auto py-4 px-8 rounded-lg'}
                asChild={true}
            >
                <Link href={`/products/${productId}/purchase`}>Get Now</Link>
            </Button>
        )
    }
}

async function Price({ price }: { price: number }) {
    const coupon = await getUserCoupon()

    if (price === 0 || !coupon)
        return <div className={'text-xl'}>{formatPrice(price)}</div>

    return (
        <div className={'flex gap-2 items-baseline'}>
            <div className={'line-through text-sm opacity-50'}>
                {formatPrice(price)}
            </div>
            <div className={'text-xl'}>
                {formatPrice(price * (1 - coupon.discountPercentage))}
            </div>
        </div>
    )
}

async function getPublicProduct(productId: string) {
    'use cache'
    cacheTag(getProductIdTag(productId))

    const product = await db.query.ProductTable.findFirst({
        columns: {
            id: true,
            name: true,
            priceInDollars: true,
            imageUrl: true,
            description: true,
        },
        where: and(eq(ProductTable.id, productId), wherePublicProducts),
        with: {
            courseProducts: {
                columns: {},
                with: {
                    course: {
                        columns: {
                            id: true,
                            name: true,
                        },
                        with: {
                            courseSections: {
                                columns: {
                                    id: true,
                                    name: true,
                                },
                                where: wherePublicCourseSections,
                                orderBy: asc(CourseSectionTable.order),
                                with: {
                                    lessons: {
                                        columns: {
                                            id: true,
                                            name: true,
                                            status: true,
                                        },
                                        where: wherePublicLessons,
                                        orderBy: asc(LessonTable.order),
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    })

    if (!product) return product

    cacheTag(
        ...product.courseProducts.flatMap((cp) => [
            getLessonCourseTag(cp.course.id),
            getCourseSectionCourseTag(cp.course.id),
            getCourseIdTag(cp.course.id),
        ])
    )

    const { courseProducts, ...rest } = product

    return {
        ...rest,
        courses: courseProducts.map((cp) => cp.course),
    }
}

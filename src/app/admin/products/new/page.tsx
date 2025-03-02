import React from 'react'
import PageHeader from '@/components/PageHeader'
import ProductForm from '@/features/products/components/ProductForm'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { getCourseGlobalTag } from '@/features/courses/db/cache/course'
import { db } from '@/drizzle/db'
import { asc } from 'drizzle-orm'
import { CourseTable } from '@/drizzle/schema/course'

const NewProductPage = async () => {
    return (
        <div className={'container my-6'}>
            <PageHeader title={'New Product'} />
            <ProductForm courses={await getCourses()}/>
        </div>
    )
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

export default NewProductPage

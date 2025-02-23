import React from 'react'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CourseTable } from '@/features/courses/components/CourseTable'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { getCourseGlobalTag } from '@/features/courses/db/cache'
import { db } from '@/drizzle/db'
import {
    CourseSectionTable,
    CourseTable as DbCourseTable,
    LessonTable,
    UserCourseAccessTable,
} from '@/drizzle/schema'
import { countDistinct, eq } from 'drizzle-orm'

const AdminCoursesPage = async () => {
    const courses = await getCourses()

    return (
        <div className={'container my-6'}>
            <PageHeader title={'Courses'}>
                <Button asChild={true}>
                    <Link href={'/admin/courses/new'}>New Course</Link>
                </Button>
            </PageHeader>

            <CourseTable courses={courses} />
        </div>
    )
}

async function getCourses() {
    'use cache'
    cacheTag(getCourseGlobalTag())
    return db
        .select({
            id: DbCourseTable.id,
            name: DbCourseTable.name,
            sectionsCount: countDistinct(CourseSectionTable),
            lessonsCount: countDistinct(LessonTable),
            studentsCount: countDistinct(UserCourseAccessTable),
        })
        .from(DbCourseTable)
        .leftJoin(
            CourseSectionTable,
            eq(CourseSectionTable.courseId, DbCourseTable.id)
        )
        .leftJoin(LessonTable, eq(LessonTable.sectionId, CourseSectionTable.id))
        .leftJoin(
            UserCourseAccessTable,
            eq(UserCourseAccessTable.courseId, DbCourseTable.id)
        )
        .orderBy(DbCourseTable.name)
        .groupBy(DbCourseTable.id)
}

export default AdminCoursesPage

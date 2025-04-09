import React from 'react'
import { cacheTag } from 'next/dist/server/use-cache/cache-tag'
import { getCourseIdTag } from '@/features/courses/db/cache/course'
import { getCourseSectionCourseTag } from '@/features/courseSections/db/cache'
import { getLessonCourseTag } from '@/features/lessons/db/cache/lessons'
import { db } from '@/drizzle/db'
import { asc, eq } from 'drizzle-orm'
import { CourseTable } from '@/drizzle/schema/course'
import { CourseSectionTable } from '@/drizzle/schema/courseSection'
import { LessonTable } from '@/drizzle/schema/lesson'
import { notFound } from 'next/navigation'
import PageHeader from '@/components/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CourseForm from '@/features/courses/components/CourseForm'
import { DialogTrigger } from '@/components/ui/dialog'
import { SectionFormDialog } from '@/features/courseSections/components/SectionFormDialog'
import { Button } from '@/components/ui/button'
import { EyeClosed, PlusIcon } from 'lucide-react'
import { SortableSectionList } from '@/features/courseSections/components/SortableSectionList'
import { cn } from '@/lib/utils'
import { LessonFormDialog } from '@/features/lessons/components/LessonFormDialog'
import { SortableLessonList } from '@/features/lessons/components/SortableLessonList'

export default async function EditCoursePage({
    params,
}: {
    params: Promise<{ courseId: string }>
}) {
    const { courseId } = await params
    const course = await getCourse(courseId)

    if (course == null) return notFound()

    return (
        <div className={'container my-6'}>
            <PageHeader title={course.name} />
            <Tabs defaultValue={'lessons'}>
                <TabsList>
                    <TabsTrigger value={'lessons'}>Lessons</TabsTrigger>
                    <TabsTrigger value={'details'}>Details</TabsTrigger>
                </TabsList>
                <TabsContent
                    value={'lessons'}
                    className={'flex flex-col gap-2'}
                >
                    <Card>
                        <CardHeader
                            className={
                                'flex items-center flex-row justify-between'
                            }
                        >
                            <CardTitle>Sections</CardTitle>
                            <SectionFormDialog courseId={courseId}>
                                <DialogTrigger asChild={true}>
                                    <Button variant={'outline'}>
                                        <PlusIcon /> New Section
                                    </Button>
                                </DialogTrigger>
                            </SectionFormDialog>
                        </CardHeader>
                        <CardContent>
                            <SortableSectionList
                                courseId={course.id}
                                sections={course.courseSections}
                            />
                        </CardContent>
                    </Card>
                    <hr className={'my-2'} />
                    {course.courseSections.map((section) => (
                        <Card key={section.id}>
                            <CardHeader
                                className={
                                    'flex items-center flex-row justify-between gap-4'
                                }
                            >
                                <CardTitle
                                    className={cn(
                                        'flex items-center gap-2',
                                        section.status === 'private' &&
                                            'text-muted-foreground'
                                    )}
                                >
                                    {section.status === 'private' && (
                                        <EyeClosed />
                                    )}{' '}
                                    {section.name}
                                </CardTitle>
                                <LessonFormDialog
                                    defaultSectionId={section.id}
                                    sections={course.courseSections}
                                >
                                    <DialogTrigger asChild={true}>
                                        <Button variant={'outline'}>
                                            <PlusIcon /> New Lesson
                                        </Button>
                                    </DialogTrigger>
                                </LessonFormDialog>
                            </CardHeader>
                            <CardContent>
                                <SortableLessonList
                                    sections={course.courseSections}
                                    lessons={section.lessons}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
                <TabsContent value={'details'}>
                    <Card>
                        <CardHeader>
                            <CourseForm course={course} />
                        </CardHeader>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

async function getCourse(courseId: string) {
    'use cache'
    cacheTag(
        getCourseIdTag(courseId),
        getCourseSectionCourseTag(courseId),
        getLessonCourseTag(courseId)
    )

    return db.query.CourseTable.findFirst({
        columns: { id: true, name: true, description: true },
        where: eq(CourseTable.id, courseId),
        with: {
            courseSections: {
                orderBy: asc(CourseSectionTable.order),
                columns: { id: true, status: true, name: true },
                with: {
                    lessons: {
                        columns: {
                            id: true,
                            name: true,
                            description: true,
                            status: true,
                            youtubeVideoId: true,
                            sectionId: true,
                        },
                        orderBy: asc(LessonTable.order),
                    },
                },
            },
        },
    })
}

'use client'

import React from 'react'
import { SortableItem, SortableList } from '@/components/SortableList'
import { cn } from '@/lib/utils'
import { EyeClosed, Trash2Icon, VideoIcon } from 'lucide-react'
import { DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ActionButton } from '@/components/ActionButton'
import { LessonStatus } from '@/drizzle/schema/lesson'
import { LessonFormDialog } from '@/features/lessons/components/LessonFormDialog'
import { deleteLesson, updateLessonOrders } from '@/features/lessons/actions/lesson'

export const SortableLessonList = ({
    sections,
    lessons,
}: {
    sections: {
        id: string
        name: string
    }[]
    lessons: {
        id: string
        name: string
        status: LessonStatus
        youtubeVideoId: string
        description: string | null
        sectionId: string
    }[]
}) => {
    return (
        <SortableList items={lessons} onOrderChange={updateLessonOrders}>
            {(items) =>
                items.map((lesson) => {
                    return (
                        <SortableItem
                            id={lesson.id}
                            key={lesson.id}
                            className={'flex items-center gap-1'}
                        >
                            <div
                                className={`flex items-center gap-1`}
                                key={lesson.id}
                            >
                                <div
                                    className={cn(
                                        'contents',
                                        lesson.status === 'private' &&
                                            'text-muted-foreground'
                                    )}
                                >
                                    {lesson.status === 'private' && (
                                        <EyeClosed className={'size-4'} />
                                    )}
                                    {lesson.status === 'preview' && (
                                        <VideoIcon className={'size-4'} />
                                    )}
                                    {lesson.name}
                                </div>
                                <LessonFormDialog
                                    sections={sections}
                                    lesson={lesson}
                                >
                                    <DialogTrigger asChild={true}>
                                        <Button
                                            variant={'outline'}
                                            size={'sm'}
                                            className={'ml-auto'}
                                        >
                                            Edit
                                        </Button>
                                    </DialogTrigger>
                                </LessonFormDialog>
                                <ActionButton
                                    action={deleteLesson.bind(null, lesson.id)}
                                    requireAreYouSure={true}
                                    size={'sm'}
                                    variant={'destructive'}
                                >
                                    <Trash2Icon />{' '}
                                    <span className={'sr-only'}>Delete</span>
                                </ActionButton>
                            </div>
                        </SortableItem>
                    )
                })
            }
        </SortableList>
    )
}

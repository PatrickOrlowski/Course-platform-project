'use client'

import React from 'react'
import { CourseSelectionStatus } from '@/drizzle/schema/courseSection'
import { SortableItem, SortableList } from '@/components/SortableList'
import { cn } from '@/lib/utils'
import { EyeClosed, Trash2Icon } from 'lucide-react'
import { SectionFormDialog } from '@/features/courseSections/components/SectionFormDialog'
import { DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ActionButton } from '@/components/ActionButton'
import {
    deleteSection,
    updateSectionOrders,
} from '@/features/courseSections/actions/sections'

export const SortableSectionList = ({
    courseId,
    sections,
}: {
    courseId: string
    sections: { id: string; name: string; status: CourseSelectionStatus }[]
}) => {
    return (
        <SortableList items={sections} onOrderChange={updateSectionOrders}>
            {(items) =>
                items.map((section) => {
                    return (
                        <SortableItem
                            id={section.id}
                            key={section.id}
                            className={'flex items-center gap-1'}
                        >
                            <div
                                className={`flex items-center gap-1`}
                                key={section.id}
                            >
                                <div
                                    className={cn(
                                        'contents',
                                        section.status === 'private' &&
                                            'text-muted-foreground'
                                    )}
                                >
                                    {section.status === 'private' && (
                                        <EyeClosed className={'size-4'} />
                                    )}
                                    {section.name}
                                </div>
                                <SectionFormDialog
                                    courseId={courseId}
                                    section={section}
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
                                </SectionFormDialog>
                                <ActionButton
                                    action={deleteSection.bind(
                                        null,
                                        section.id
                                    )}
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

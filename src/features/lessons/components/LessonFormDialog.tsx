'use client'

import React, { ReactNode, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { LessonStatus } from '@/drizzle/schema/lesson'
import LessonForm from '@/features/lessons/components/LessonForm'

export const LessonFormDialog = ({
    sections,
    children,
    defaultSectionId,
    lesson,
}: {
    sections: { id: string; name: string }[]
    children: ReactNode
    defaultSectionId?: string
    lesson?: {
        id: string
        name: string
        status: LessonStatus
        youtubeVideoId: string
        description: string | null
        sectionId: string
    }
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            {children}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {lesson == null ? 'New Lesson' : `Edit ${lesson.name}`}
                    </DialogTitle>
                </DialogHeader>
                <div className={'mt-4'}>
                    <LessonForm
                        sections={sections}
                        lesson={lesson}
                        defaultSectionId={defaultSectionId}
                        onSuccess={() => {
                            setIsDialogOpen(false)
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

'use client'

import React, { ReactNode, useState } from 'react'
import { CourseSelectionStatus } from '@/drizzle/schema/courseSection'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import SectionForm from '@/features/courseSections/components/SectionForm'

export const SectionFormDialog = ({
    courseId,
    section,
    children,
}: {
    courseId: string
    section?: { id: string; name: string; status: CourseSelectionStatus }
    children: ReactNode
}) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            {children}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {section == null ? 'New Section' : `Edit ${section.name}`}
                    </DialogTitle>
                </DialogHeader>
                <div className={'mt-4'}>
                    <SectionForm section={section} courseId={courseId} onSuccess={()=>{
                        setIsDialogOpen(false)
                    }}/>
                </div>
            </DialogContent>
        </Dialog>
    )
}

import React from 'react'
import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const AdminCoursesPage = () => {
    return (
        <div className={'container my-6'}>
            <PageHeader title={'Courses'}>
                <Button asChild={true}>
                    <Link href={'/admin/courses/new'}>New Course</Link>
                </Button>
            </PageHeader>

            <div>asd</div>
        </div>
    )
}

export default AdminCoursesPage

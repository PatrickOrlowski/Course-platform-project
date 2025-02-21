import React from 'react'
import { cn } from '@/lib/utils'

const PageHeader = ({
    title,
    children,
    className,
}: {
    title: string
    children?: React.ReactNode
    className?: string
}) => {
    return (
        <div
            className={cn(
                'mb-8 flex gap-4 items-center justify-between',
                className
            )}
        >
            <h1 className={'text-2xl font-semibold'}>{title}</h1>
            {children && <div className={''}>{children}</div>}
        </div>
    )
}

export default PageHeader

import React from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const SkeletonButton = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                buttonVariants({
                    variant: 'secondary',
                    className: 'pointer-events-none animate-pulse w-24',
                }),
                className
            )}
        />
    )
}

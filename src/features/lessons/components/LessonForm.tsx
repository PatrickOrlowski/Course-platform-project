'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { RequiredLabelIcon } from '@/components/RequiredLabelIcon'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { actionToast } from '@/lib/actionToast'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { LessonStatus, lessonStatuses } from '@/drizzle/schema/lesson'
import { lessonSchema } from '@/features/lessons/schemas/lesson'
import { Textarea } from '@/components/ui/textarea'
import { createLesson, updateLesson } from '@/features/lessons/actions/lesson'

const LessonForm = ({
    sections,
    defaultSectionId,
    onSuccess,
    lesson,
}: {
    sections: {
        id: string
        name: string
    }[]
    onSuccess?: () => void
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
    const form = useForm<z.infer<typeof lessonSchema>>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: lesson?.name ?? '',
            status: lesson?.status ?? 'public',
            youtubeVideoId: lesson?.youtubeVideoId ?? '',
            description: lesson?.description ?? '',
            sectionId:
                lesson?.sectionId ?? defaultSectionId ?? sections[0]?.id ?? '',
        },
    })

    const videoId = form.watch('youtubeVideoId')

    const onSubmit = async (values: z.infer<typeof lessonSchema>) => {
        const action =
            lesson == null ? createLesson : updateLesson.bind(null, lesson.id)
        const data = await action(values)
        actionToast({
            actionData: data,
        })
        if (!data.error) {
            onSuccess?.()
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={'flex flex-col gap-6 @container'}
            >
                <div className={'grid grid-cols-1 @lg:grid-cols-2 gap-6'}>
                    <FormField
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <RequiredLabelIcon />
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        name={'name'}
                        control={form.control}
                    />
                    <FormField
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <RequiredLabelIcon />
                                    Youtube Video ID
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        name={'youtubeVideoId'}
                        control={form.control}
                    />
                    <FormField
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Section</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sections.map((section) => (
                                            <SelectItem
                                                key={section.id}
                                                value={section.id}
                                            >
                                                {section.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        name={'sectionId'}
                        control={form.control}
                    />
                    <FormField
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {lessonStatuses.map((status) => (
                                            <SelectItem
                                                key={status}
                                                value={status}
                                            >
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        name={'status'}
                        control={form.control}
                    />
                    <FormField
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Description
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        className={'min-h-20 resize-none'}
                                        value={field.value ?? ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        name={'description'}
                        control={form.control}
                    />
                </div>
                <div className={'self-end'}>
                    <Button
                        type={'submit'}
                        disabled={form.formState.isSubmitting}
                    >
                        Save
                    </Button>
                </div>
                {/*{videoId && <YoutubeVideoPlayer videoId={videoId} />}*/}
            </form>
        </Form>
    )
}

export default LessonForm

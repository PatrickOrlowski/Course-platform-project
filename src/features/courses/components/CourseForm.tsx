'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { courseSchema } from '@/features/courses/schemas/courses'
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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createCourse, updateCourse } from '@/features/courses/actions/courses'
import { actionToast } from '@/lib/actionToast'

const CourseForm = ({
    course,
}: {
    course?: z.infer<typeof courseSchema> & {
        id: string
    }
}) => {
    const form = useForm<z.infer<typeof courseSchema>>({
        resolver: zodResolver(courseSchema),
        defaultValues: course ?? {
            name: '',
            description: '',
        },
    })

    const onSubmit = async (values: z.infer<typeof courseSchema>) => {
        const action =
            course == null ? createCourse : updateCourse.bind(null, course.id)
        const data = await action(values)
        actionToast({
            actionData: data,
        })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={'flex flex-col gap-6'}
            >
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
                                Description
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    className={'min-h-20 resize-none'}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name={'description'}
                    control={form.control}
                />
                <div className={'self-end'}>
                    <Button
                        type={'submit'}
                        disabled={form.formState.isSubmitting}
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CourseForm

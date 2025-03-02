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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { actionToast } from '@/lib/actionToast'
import { productSchema } from '@/features/products/schema/products'
import { ProductStatus, productStatuses } from '@/drizzle/schema/product'
import {
    createProduct,
    updateProduct,
} from '@/features/products/actionts/products'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { MultiSelect } from '@/components/ui/custom/multi-select'

const ProductForm = ({
    product,
    courses,
}: {
    product?: z.infer<typeof productSchema> & {
        id: string
        name: string
        description: string
        imageUrl: string
        status: ProductStatus
        priceInDollars: number
        courseIds: string[]
    }
    courses: { id: string; name: string }[]
}) => {
    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: product ?? {
            name: '',
            description: '',
            courseIds: [],
            imageUrl: '',
            status: 'private',
            priceInDollars: 0,
        },
    })

    const onSubmit = async (values: z.infer<typeof productSchema>) => {
        const action =
            product == null
                ? createProduct
                : updateProduct.bind(null, product.id)
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
                <div
                    className={
                        'grid grid-cols-1 md:grid-cols-2 gap-6 items-start'
                    }
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
                                    Price
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type={'number'}
                                        step={1}
                                        min={0}
                                        onChange={(e) =>
                                            field.onChange(
                                                isNaN(e.target.valueAsNumber)
                                                    ? ''
                                                    : e.target.valueAsNumber
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        name={'priceInDollars'}
                        control={form.control}
                    />
                    <FormField
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <RequiredLabelIcon />
                                    Image URL
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        name={'imageUrl'}
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
                                        {productStatuses.map((status) => (
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
                </div>
                <FormField
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Included Courses</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    options={courses}
                                    getValue={(c) => c.id}
                                    getLabel={(c) => c.name}
                                    selectedValues={field.value}
                                    onSelectedValuesChange={field.onChange}
                                    selectPlaceholder={'Select courses'}
                                    searchPlaceholder={'Search courses'}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    name={'courseIds'}
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

export default ProductForm

import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { formatPlural, formatPrice } from '@/lib/formatters'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { EyeIcon, LockIcon, Trash2Icon } from 'lucide-react'
import { ActionButton } from '@/components/ActionButton'
import { ProductStatus } from '@/drizzle/schema/product'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { deleteProduct } from '@/features/products/actionts/products'

export const ProductTable = ({
    products,
}: {
    products: {
        id: string
        name: string
        description: string
        imageUrl: string
        priceInDollars: number
        status: ProductStatus
        courseCount: number
        customerCount: number
    }[]
}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        {formatPlural(products.length, {
                            singular: 'product',
                            plural: 'products',
                        })}
                    </TableHead>
                    <TableHead>Customers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>
                            <div className="flex items-center gap-4">
                                <Image
                                    src={product.imageUrl}
                                    alt={'products'}
                                    width={192}
                                    height={192}
                                    className={'object-cover rounded size-12'}
                                />
                                <div className={'flex flex-col gap-1'}>
                                    <div className={'font-semibold'}>
                                        {product.name}
                                    </div>
                                    <div className={'text-muted-foreground'}>
                                        {formatPlural(product.courseCount, {
                                            singular: 'course',
                                            plural: 'courese',
                                        })}{' '}
                                        • {formatPrice(product.priceInDollars)}
                                    </div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>{product.customerCount}</TableCell>
                        <TableCell>
                            <Badge className={'inline-flex items-center gap-2'}>
                                {getStatusIcon(product.status)} {product.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button asChild>
                                    <Link
                                        href={`/admin/products/${product.id}/edit`}
                                    >
                                        Edit
                                    </Link>
                                </Button>
                                <ActionButton
                                    variant="destructive"
                                    requireAreYouSure={true}
                                    action={deleteProduct.bind(
                                        null,
                                        product.id
                                    )}
                                >
                                    <Trash2Icon />
                                    <span className="sr-only">Delete</span>
                                </ActionButton>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

function getStatusIcon(status: ProductStatus) {
    const Icon =
        {
            public: EyeIcon,
            private: LockIcon,
        }[status] || EyeIcon

    return <Icon className={'size-14'} />
}

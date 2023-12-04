'use client'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { ProductForSellColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { ApiList } from '@/components/ui/api-list'

interface ProductForSellClientProps {
	data: ProductForSellColumn[]
}

export const ProductForSellClient: React.FC<
	ProductForSellClientProps
> = ({ data }) => {
	const router = useRouter()
	const params = useParams()

	return (
		<>
			<div className='flex items-center justify-between'>
				<Heading
					title={`Productos en venta ${data.length}`}
					description='Organiza tus productos'
				/>
				<Button
					onClick={() => {
						router.push(
							`/${params.storeId}/productsForSell/new`
						)
					}}>
					<Plus className='mr-2 w-4 h-4' />
					Nuevo producto para ventas
				</Button>
			</div>
			<Separator />
			<DataTable
				searchKey='name'
				columns={columns}
				data={data}
			/>
			<Heading
				title='API'
				description='API endpoints para productos de ventas'
			/>
			<Separator />
			<ApiList
				entityName='productsForSell'
				entityIdName='productForSellId'
			/>
		</>
	)
}

import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { ProductForSellClient } from './components/client'
import { ProductForSellColumn } from './components/columns'
import { formatter } from '@/lib/utils'

const ProductForSellPage = async ({
	params,
}: {
	params: { storeId: string }
}) => {
	const productForSell =
		await prismadb.productForSell.findMany({
			where: { storeId: params.storeId },
			include: { category: true },
			orderBy: { createdAt: 'desc' },
		})

	const formatedproduct: ProductForSellColumn[] =
		productForSell.map((item) => ({
			id: item.id,
			name: item.name,
			isFeatured: item.isFeatured,
			isArchived: item.isArchived,
			category: item.category.name,
			height: item.height,
			width: item.width,
			weight: item.weight,
			price: formatter.format(item.price.toNumber()),
			createdAt: format(item.createdAt, 'MMMM do, YYY'),
		}))

	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<ProductForSellClient data={formatedproduct} />
			</div>
		</div>
	)
}

export default ProductForSellPage

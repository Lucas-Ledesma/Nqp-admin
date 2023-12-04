import prismadb from '@/lib/prismadb'
import { ProductForSellForm } from './components/product-for-sell-form'

const ProductForSellPage = async ({
	params,
}: {
	params: { productForSellId: string; storeId: string }
}) => {
	const productForSell =
		await prismadb.productForSell.findUnique({
			where: { id: params.productForSellId },
			include: { images: true },
		})

	const categories = await prismadb.category.findMany({
		where: { storeId: params.storeId },
	})

	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<ProductForSellForm
					initialData={productForSell}
					categories={categories}
				/>
			</div>
		</div>
	)
}

export default ProductForSellPage

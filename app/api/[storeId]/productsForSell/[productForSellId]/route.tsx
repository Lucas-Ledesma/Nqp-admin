import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function PATCH(
	req: Request,
	{
		params,
	}: {
		params: { storeId: string; productForSellId: string }
	}
) {
	try {
		const { userId } = auth()

		const body = await req.json()

		const {
			name,
			categoryId,
			description,
			images,
			isFeatured,
			isArchived,
			height,
			length,
			widht,
			weight,
			price,
		} = body

		if (!userId) {
			return new NextResponse('Unauthenticated.', {
				status: 401,
			})
		}

		if (!name) {
			return new NextResponse('Name is required', {
				status: 400,
			})
		}

		if (!images || !images.length) {
			return new NextResponse('Images is required', {
				status: 400,
			})
		}

		if (!categoryId) {
			return new NextResponse('Category id is required', {
				status: 400,
			})
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: params.storeId, userId },
		})

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', {
				status: 403,
			})
		}

		await prismadb.productForSell.update({
			where: {
				id: params.productForSellId,
			},
			data: {
				name,
				categoryId,
				description,
				images: { deleteMany: {} },
				isFeatured,
				isArchived,
				height,
				length,
				weight,
				widht,
				price,
			},
		})

		const productForSell =
			await prismadb.productForSell.update({
				where: { id: params.productForSellId },
				data: {
					images: {
						createMany: {
							data: [
								...images.map(
									(image: { url: string }) => image
								),
							],
						},
					},
				},
			})

		return NextResponse.json(productForSell)
	} catch (error) {
		console.log('[PRODUCT_FOR_SELL_PATCH]', error)
		return new NextResponse('internal error', {
			status: 500,
		})
	}
}

export async function DELETE(
	req: Request,
	{
		params,
	}: {
		params: { storeId: string; productForSellId: string }
	}
) {
	try {
		const { userId } = auth()

		if (!userId) {
			return new NextResponse('Unauthenticated', {
				status: 401,
			})
		}

		if (!params.productForSellId) {
			return new NextResponse('Porduct id is required.', {
				status: 404,
			})
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: { id: params.storeId, userId },
		})

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', {
				status: 403,
			})
		}

		const productForSell =
			await prismadb.productForSell.findUnique({
				where: { id: params.productForSellId },
			})

		if (!productForSell) {
			return new NextResponse('Product not found', {
				status: 404,
			})
		}

		const deletedProductForSell =
			await prismadb.product.delete({
				where: {
					id: params.productForSellId,
				},
			})

		return NextResponse.json(deletedProductForSell)
	} catch (error) {
		console.log('[PRODUCT_FOR_SELL_DELETE]', error)
		return new NextResponse('internal error', {
			status: 500,
		})
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { productForSellId: string } }
) {
	try {
		if (!params.productForSellId) {
			return new NextResponse('Product id is required.', {
				status: 404,
			})
		}

		const productForSell =
			await prismadb.productForSell.findUnique({
				where: {
					id: params.productForSellId,
				},
				include: { images: true, category: true },
			})

		return NextResponse.json(productForSell)
	} catch (error) {
		console.log('[PRODUCT_FOR_SELL_GET]', error)
		return new NextResponse('internal error', {
			status: 500,
		})
	}
}

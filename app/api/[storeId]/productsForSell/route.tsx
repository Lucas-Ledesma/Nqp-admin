import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth()
		const body = await req.json()
		const {
			name,
			categoryId,
			images,
			isFeatured,
			isArchived,
			description,
			length,
			weight,
			height,
			width,
			price,
		} = body

		if (!userId) {
			return new NextResponse('Unauthenticated', {
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

		if (!params.storeId) {
			return new NextResponse('Store id is required', {
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

		const product = await prismadb.productForSell.create({
			data: {
				name,
				description,
				categoryId,
				images: {
					createMany: {
						data: [
							...images.map(
								(image: { url: string }) => image
							),
						],
					},
				},
				isFeatured,
				height,
				length,
				width,
				weight,
				price,
				isArchived,
				storeId: params.storeId,
			},
		})

		return NextResponse.json(product)
	} catch (error) {
		console.log('[PRODUCT_FOR_SELL: POST]', error)
		return new NextResponse('Internal error', {
			status: 500,
		})
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { searchParams } = new URL(req.url)
		const categoryId =
			searchParams.get('categoryId') || undefined
		const isFeatured = searchParams.get('isFeatured')

		if (!params.storeId) {
			return new NextResponse('Store id is required', {
				status: 400,
			})
		}

		const productsForSell =
			await prismadb.productForSell.findMany({
				where: {
					storeId: params.storeId,
					categoryId,
					isFeatured: isFeatured ? true : undefined,
					isArchived: false,
				},
				include: { images: true, category: true },
				orderBy: { createdAt: 'desc' },
			})

		return NextResponse.json(productsForSell)
	} catch (error) {
		console.log('[PRODUCT_FOR_SELL: GET]', error)
		return new NextResponse('Internal error', {
			status: 500,
		})
	}
}

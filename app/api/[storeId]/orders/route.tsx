import prismadb from '@/lib/prismadb'
import mercadopago from 'mercadopago'
import { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model'
import { NextResponse } from 'next/server'

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods':
		'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers':
		'Content-Type, Authorization',
}

export async function OPTIONS() {
	return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(
	req: Request,
	{
		params,
	}: {
		params: { storeId: string }
	}
) {
	const { productIds } = await req.json()

	if (!productIds || productIds.length === 0) {
		return new NextResponse('Product ids are required', {
			status: 400,
		})
	}

	const products = await prismadb.productForSell.findMany({
		where: {
			id: {
				in: productIds,
			},
		},
	})

	const storeId = params.storeId

	mercadopago.configure({
		access_token: process.env.MERCADO_PAGO_TOKEN!,
	})

	const preference: CreatePreferencePayload = {
		items: products.map((product) => ({
			id: product.id,
			title: product.name,
			currency_id: 'ARS',
			quantity: 1,
			unit_price: parseFloat(product.price.toString()),
			description: product.description,
		})),
		back_urls: {
			success: `http://localhost:3000/cart`,
			failure: `http://localhost:3000/cart`,
		},
		notification_url: `https://997f-2803-9800-9543-81cf-f1b8-b58f-439f-42ce.ngrok-free.app/api/${storeId}/orders/notification`,
		auto_return: 'approved',
	}

	const result = await mercadopago.preferences.create(
		preference
	)

	return NextResponse.json(
		{ url: result.body.init_point },
		{
			headers: corsHeaders,
		}
	)
}

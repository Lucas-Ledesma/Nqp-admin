import mercadopago from 'mercadopago'
import { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model'
import { NextResponse } from 'next/server'

export async function POST(
	req: Request,
	{
		params,
	}: {
		params: { storeId: string }
	}
) {
	const body = await req.json()
	const {
		id,
		currency_id,
		title,
		quantity,
		unit_price,
		description,
	} = body

	if (!id || !title || !quantity || !unit_price) {
		return new NextResponse('Missing required fields', {
			status: 400,
		})
	}

	const storeId = params.storeId

	mercadopago.configure({
		access_token: process.env.MERCADO_PAGO_TOKEN!,
	})

	const preference: CreatePreferencePayload = {
		items: [
			{
				id,
				currency_id,
				title,
				quantity,
				unit_price,
				description,
			},
		],
		back_urls: {
			success: `http://localhost:3000/api/${storeId}/orders/success`,
			failure: `http://localhost:3000/api/${storeId}/orders/failure`,
		},
		notification_url: `https://f60b-2803-9800-9543-7613-19ea-5de6-73fe-ccc7.ngrok-free.app/api/${storeId}/orders/notification`,
		auto_return: 'approved',
	}

	const result = await mercadopago.preferences.create(
		preference
	)
	return new NextResponse(JSON.stringify(result))
}

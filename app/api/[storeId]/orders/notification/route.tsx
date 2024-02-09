import { NextResponse } from 'next/server'
import mercadopago from 'mercadopago'

export async function POST(req: Request) {
	const body = await req.json()

	mercadopago.configure({
		access_token: process.env.MERCADO_PAGO_TOKEN!,
	})

	console.log('body', body)

	if (body.action === 'payment.created') {
		let payment = await mercadopago.payment.get(
			Number(body.data.id)
		)

		console.log('payment', payment)
	}

	return new NextResponse('success')
}

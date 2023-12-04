import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'
import mercadopago from 'mercadopago'

export async function POST(req: Request) {
	const body = await req.json()

	console.log('body', body)

	if (body.action === 'payment.created') {
		const payment = await mercadopago.payment.findById(
			Number(body.data.id)
		)

		console.log('payment', payment)
	}

	return new NextResponse('success')
}

import { NextResponse } from 'next/server'
import { Request } from 'express'

export async function GET(req: Request) {
	return new NextResponse('success')
}

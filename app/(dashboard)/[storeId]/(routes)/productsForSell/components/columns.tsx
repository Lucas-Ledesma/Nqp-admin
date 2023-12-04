'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './cell-action'

export type ProductForSellColumn = {
	id: string
	name: string
	category: string
	isFeatured: boolean
	isArchived: boolean
	createdAt: string
	price: string
	height: number
	length: number
	weight: number
	widht: number
}

export const columns: ColumnDef<ProductForSellColumn>[] = [
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
	{
		accessorKey: 'name',
		header: 'Nombre',
	},
	{
		accessorKey: 'height',
		header: 'Altura',
	},
	{
		accessorKey: 'length',
		header: 'Largo',
	},
	{
		accessorKey: 'widht',
		header: 'Ancho',
	},
	{
		accessorKey: 'weight',
		header: 'Peso',
	},
	{
		accessorKey: 'price',
		header: 'Precio',
	},
	{
		accessorKey: 'isArchived',
		header: 'Archivado',
	},
	{
		accessorKey: 'isFeatured',
		header: 'En stock',
	},
	{
		accessorKey: 'category',
		header: 'Categoría',
	},
	{
		accessorKey: 'createdAt',
		header: 'Fecha de creación',
	},
]

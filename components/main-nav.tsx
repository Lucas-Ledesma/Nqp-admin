'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from './ui/sheet'
import { Menu } from 'lucide-react'

export default function MainNav({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const pathname = usePathname()
	const params = useParams()

	const routes = [
		{
			href: `/${params.storeId}/categories`,
			label: 'Categorias',
			active: pathname === `/${params.storeId}/categories`,
		},
		{
			href: `/${params.storeId}/products`,
			label: 'Productos',
			active: pathname === `/${params.storeId}/products`,
		},
		{
			href: `/${params.storeId}/productsForSell`,
			label: 'Productos en venta',
			active:
				pathname === `/${params.storeId}/productsForSell`,
		},
		{
			href: `/${params.storeId}/settings`,
			label: 'Configuración',
			active: pathname === `/${params.storeId}/settings`,
		},
	]
	return (
		<nav
			className={cn(
				'items-center md:space-x-4 lg:space-x-6 flex ',
				className
			)}>
			{routes.map((route) => (
				<Link
					key={route.href}
					href={route.href}
					className={cn(
						'text-sm font-medium transition-colors hover:text-primary hidden md:flex',
						route.active
							? 'text-black dark:text-white'
							: 'text-muted-foreground'
					)}>
					{route.label}
				</Link>
			))}
			<Sheet>
				<SheetTrigger className='md:hidden hover:opacity-75 transition'>
					<Menu />
				</SheetTrigger>
				<SheetContent
					side='left'
					className='pt-14 shadow-none w-[250px] flex flex-col'>
					{routes.map((route) => (
						<Link
							key={route.href}
							href={route.href}
							className={cn(
								'text-xl font-medium transition-colors hover:text-primary',
								route.active
									? 'text-black dark:text-white'
									: 'text-muted-foreground'
							)}>
							<li>{route.label}</li>
						</Link>
					))}
				</SheetContent>
			</Sheet>
		</nav>
	)
}

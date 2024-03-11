'use client'

import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import {
	Category,
	ImageForProductsForSell,
	ProductForSell,
} from '@prisma/client'
import { Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { AlertModal } from '@/components/modals/alert-modal'
import ImageUpload from '@/components/ui/image-upload'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'

interface ProductFormProps {
	initialData:
		| (ProductForSell & {
				images: ImageForProductsForSell[]
		  })
		| null
	categories: Category[]
}

const formSchema = z.object({
	name: z.string().min(1),
	images: z.object({ url: z.string() }).array(),
	description: z.string().min(1).optional(),
	height: z.coerce.number().min(1),
	width: z.coerce.number().min(1),
	price: z.coerce.number().min(1),
	weight: z.coerce.number().min(1),
	categoryId: z.string().min(1),
	isFeatured: z.boolean().default(false).optional(),
	isArchived: z.boolean().default(false).optional(),
})

type SettingFormValue = z.infer<typeof formSchema>

export const ProductForSellForm: React.FC<
	ProductFormProps
> = ({ initialData, categories }) => {
	const params = useParams()
	const router = useRouter()
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const title = initialData
		? 'Edita tu Producto de ventas'
		: 'Crea tu Producto de ventas'
	const description = initialData
		? 'Edita un Product de ventas'
		: 'Crea un nuevo Producto de ventas'
	const toastMessage = initialData
		? 'Producto actualizado.'
		: 'Producto Creado.'
	const action = initialData
		? 'Guardar Cambios'
		: 'Crear Producto'

	const form = useForm<SettingFormValue>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
			? {
					...initialData,
					price: parseFloat(String(initialData?.price)),
			  }
			: {
					name: '',
					images: [],
					categoryId: '',
					isFeatured: false,
					isArchived: false,
					height: 0,
					width: 0,
					price: 0,
			  },
	})

	const onSubmit = async (data: SettingFormValue) => {
		try {
			setLoading(true)
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/productsForSell/${params.productForSellId}`,
					data
				)
			} else {
				await axios.post(
					`/api/${params.storeId}/productsForSell`,
					data
				)
			}
			router.refresh()
			router.push(`/${params.storeId}/productsForSell`)
			toast.success(toastMessage)
		} catch (error) {
			toast.error('algo salio mal.')
		} finally {
			setLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setLoading(true)
			await axios.delete(
				`/api/${params.storeId}/productsForSell/${params.productForSellId}`
			)
			router.refresh()
			router.push(`/${params.storeId}/productsForSell`)
			toast.success('Producto eliminado.')
		} catch (error) {
			toast.error('Algo salio mal.')
		} finally {
			setLoading(false)
			setOpen(false)
		}
	}

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className='flex items-center justify-between'>
				<Heading title={title} description={description} />
				{initialData && (
					<Button
						disabled={loading}
						variant='destructive'
						size='sm'
						onClick={() => {
							setOpen(true)
						}}>
						<Trash className='h-4 w-4' />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8 w-full'>
					<FormField
						control={form.control}
						name='images'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Imagenes</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value.map(
											(image) => image.url
										)}
										disabled={loading}
										onChange={(url) =>
											field.onChange([
												...field.value,
												{ url },
											])
										}
										onRemove={(url) =>
											field.onChange([
												...field.value.filter(
													(current) => current.url !== url
												),
											])
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder='Nombre de producto'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='categoryId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Categoría</FormLabel>
									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue
													defaultValue={field.value}
													placeholder='Elije una Categoría.'
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories.map((category) => (
												<SelectItem
													key={category.id}
													value={category.id}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='price'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price</FormLabel>
									<FormControl>
										<Input
											type='number'
											disabled={loading}
											placeholder='9.99'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='weight'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Peso (en Gramos)</FormLabel>
									<FormControl>
										<Input
											type='number'
											disabled={loading}
											placeholder='9.99'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='width'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ancho (en cm)</FormLabel>
									<FormControl>
										<Input
											type='number'
											disabled={loading}
											placeholder='10 cm'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='height'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Alto (en cm)</FormLabel>
									<FormControl>
										<Input
											type='number'
											disabled={loading}
											placeholder='10 cm'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descripción</FormLabel>
									<FormControl>
										<Textarea
											disabled={loading}
											placeholder='Descripción de producto'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='isFeatured'
							render={({ field }) => (
								<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
									<FormControl>
										<Checkbox
											checked={field.value}
											//@ts-ignore
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className='space-y-1 leading-none'>
										<FormLabel>Habilitado</FormLabel>
										<FormDescription>
											Este producto aparecerá en la pagina.
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='isArchived'
							render={({ field }) => (
								<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
									<FormControl>
										<Checkbox
											checked={field.value}
											//@ts-ignore
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className='space-y-1 leading-none'>
										<FormLabel>Archivado</FormLabel>
										<FormDescription>
											Este producto no aparecerá en la
											pagina.
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
					</div>
					<Button
						disabled={loading}
						className='ml-auto'
						type='submit'>
						{action}
					</Button>
				</form>
			</Form>
		</>
	)
}

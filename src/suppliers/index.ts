import { AcquireProduct } from '..'

type ProductMapper<SupplierProduct> = (
	product: SupplierProduct
) => AcquireProduct

export const CountryCodes = {
	NZ: 'nz',
	AU: 'au',
} as const

type CountryCode = typeof CountryCodes[keyof typeof CountryCodes]

export class Supplier<SupplierProduct> {
	name: string
	code: string
	country: CountryCode
	mapProduct: ProductMapper<SupplierProduct>
	getFeed: () => Promise<SupplierProduct[]>

	constructor({
		name,
		code,
		country,
		productMapper,
		getFeed,
	}: {
		name: string
		code: string
		country?: CountryCode
		productMapper: ProductMapper<SupplierProduct>
		getFeed: () => Promise<SupplierProduct[]>
	}) {
		this.name = name
		this.code = code
		this.country = country ?? CountryCodes.NZ
		this.mapProduct = productMapper
		this.getFeed = getFeed
	}

	mapFeed: (feed: SupplierProduct[]) => Promise<AcquireProduct[]> = async (
		feed
	) => {
		return feed.map(this.mapProduct)
	}
}

import westan from './westan'

export default { westan }

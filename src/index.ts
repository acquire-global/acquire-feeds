import suppliers from './suppliers'
export { default as convertToCsv } from './csv'

export interface AcquireProduct {
	brand: string
	manufacturerCode: string
	name: string
	buy: string | number
	stock?: string | number
	rrp?: string | number
	description?: string
	imageUrl?: string
	category?: string
	supplierCode?: string | number
	features?: string
	specifications?: string
	eta?: string
	warranty?: string
	weight?: string
	gtin?: string
	colour?: string
	accessories?: string
	vendorUrl?: string
	supplierUrl?: string
	shipping?: string
	minLicenseQuantity?: string
	maxLicenseQuantity?: string
	requiresEndUserDetails?: boolean
}

export default suppliers

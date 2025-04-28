import { CountryCodes, Supplier } from '..'

const pacificomm = new Supplier<{}>({
	name: 'Pacificomm',
	code: 'pacificomm',
	country: CountryCodes.NZ,
	productMapper: (product) => {
		//TODO: Implement product mapper
		return {
			brand: '',
			manufacturerCode: '',
			name: '',
			buy: 0,
			stock: 0,
			rrp: 0,
			description: '',
			imageUrl: '',
			category: '',
			supplierCode: '',
			features: '',
			specifications: '',
			eta: '',
			warranty: '',
			weight: '',
			gtin: '',
			colour: '',
			accessories: '',
			vendorUrl: '',
			supplierUrl: '',
			shipping: '',
			minLicenseQuantity: '',
			maxLicenseQuantity: '',
			requiresEndUserDetails: false,
		}
	},
	getFeed: async () => {
		//TODO: Implement getFeed
		return Promise.resolve([{}])
	},
})

export default pacificomm

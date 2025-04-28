import { CountryCodes, Supplier } from '..'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import {
	ApiItemCategory,
	ApiResult,
	DescriptionItem,
	ErrorResponse,
	LoginDetails,
	SpecHeader,
	SpecItem,
	WestanProduct,
	isErrorResponse,
} from './api'
axiosRetry(axios, { retries: 3 })

const westan = new Supplier<WestanProduct>({
	name: 'Westan',
	code: 'westan',
	country: CountryCodes.NZ,
	productMapper: (product) => {
		return {
			brand: product.pagetitle.split('|')[0].trim(),
			manufacturerCode: product.itemid,
			name: product.storedisplayname2,
			buy:
				product.onlinecustomerprice_detail.onlinecustomerprice_formatted || 0,
			stock: product.quantityavailable,
			rrp: product.pricelevel5,
			description: parseDescription(product.custitem_anx_sca_description),
			imageUrl: product.itemimages_detail?.urls?.[0].url ?? '',
			category: consolidateCategories(product.commercecategory.primarypath),
			supplierCode: product.internalid,
			features: '',
			specifications: parseSpecs(product.custitem_anx_sca_specifications),
			eta: '',
			warranty: '',
			weight: '',
			gtin: '',
			colour: '',
			accessories: '',
			vendorUrl: '',
			supplierUrl: `https://www.westan.net.nz/${product.urlcomponent}`,
			shipping: '',
			minLicenseQuantity: '',
			maxLicenseQuantity: '',
			requiresEndUserDetails: false,
		}
	},
	getFeed: fetchData,
})

function parseDescription(rawString: string): string {
	if (rawString.length === 0) {
		return ''
	}
	const rawDescription = JSON.parse(rawString) as DescriptionItem[]
	let description = ''

	rawDescription.forEach((item) => {
		description += `<h3>${item.title}</h3>`
		description += `<p>${item.body_text}</p>`
		description += item.rich_text ?? ''
	})

	return description
}

function consolidateCategories(itemCategories: ApiItemCategory[]): string {
	return itemCategories.reduceRight((acc, val, i) => {
		if (i == itemCategories.length - 1) {
			return acc
		}
		if (i == itemCategories.length - 2) {
			return val.name
		}
		return acc + ` | ${val.name}`
	}, '')
}

function parseSpecs(rawString: string): string {
	if (rawString.length === 0) {
		return ''
	}
	const rawSpecs = JSON.parse(rawString) as (SpecHeader | SpecItem)[]
	let specs =
		'<div class="table-responsive"><table class="table table-hover table-sm table-borderless"><tbody>'
	let endOfSpecs = `</tbody></table></div>`

	rawSpecs.forEach((item) => {
		if ('is_title' in item) {
			specs += `<tr class="table-info"><td colspan="2">${item.name}</td></tr>`
		} else {
			specs += `<tr><td>${item.name}</td><td>${item.value}</td></tr>`
		}
	})

	return specs + endOfSpecs
}

async function fetchData(offset = 0, limit = 100) {
	const westanEmail = process.env.WESTAN_USERNAME
	const westanPassword = process.env.WESTAN_PASSWORD

	if (!westanEmail || !westanPassword) {
		throw new Error(
			'Missing Westan credentials. Please ensure WESTAN_USERNAME and WESTAN_PASSWORD are set in your environment.'
		)
	}

	const axiosClient = axios.create({
		withCredentials: true,
		params: {
			country: 'AU',
			currency: 'NZD',
			custitem_anx_domain_filters: 'www.westan.net.nz',
			fieldset: 'details',
			include: 'facets',
			language: 'en',
		},
	})
	try {
		await axiosClient
			.post<LoginDetails | ErrorResponse>(
				'https://www.westan.net.nz/app/services/Account.Login.Service.ss?n=2&c=3741511',
				{
					email: westanEmail,
					password: westanPassword,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
					},
				}
			)
			.then((loginResult) => {
				if (loginResult.status !== 200) {
					throw new Error(
						`Westan login failed with status code ${loginResult.status}`
					)
				}
				const data = loginResult.data
				if (isErrorResponse(data)) {
					throw new Error(data.errorMessage)
				}
				const [cookie] = loginResult.headers['set-cookie']!
				axiosClient.defaults.headers.common = { Cookie: cookie }
				console.log(`Logged in to Westan as ${data.user.email}`)
			})
	} catch (error) {
		console.log(error)
		return []
	}

	let items = [] as WestanProduct[]
	let more = true
	while (more) {
		let response = await axiosClient
			.get('https://www.westan.net.nz/api/items', { params: { offset, limit } })
			.catch((error) => {
				console.error(error)
				more = false
				throw error
			})
		let apiResult = response.data as ApiResult
		items = [...items, ...apiResult.items]
		console.log(
			`Fetched ${apiResult.items.length} new products, for ${items.length} total products so far...`
		)

		if (apiResult.links.some((link) => link.rel === 'next')) {
			offset += limit
		} else more = false
	}
	return items
}

export default westan

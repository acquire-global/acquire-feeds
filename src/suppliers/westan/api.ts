type TrueOrFalse = 'T' | 'F'

export interface LoginDetails {
	touchpoints: Touchpoints
	user: User
	cart: Cart
	address: Address[]
	creditcard: unknown[]
	language: Language
	currency: Currency
}

export interface ErrorResponse {
	errorStatusCode: string
	errorCode: string
	errorMessage: string
}

export function isErrorResponse(
	response: ErrorResponse | LoginDetails
): response is ErrorResponse {
	return (response as ErrorResponse).errorStatusCode !== undefined
}

interface Cart {
	lines: unknown[]
	lines_sort: unknown[]
	latest_addition: unknown
	promocodes: unknown[]
	ismultishipto: boolean
	shipmethods: unknown[]
	shipmethod: unknown
	addresses: Address[]
	billaddress: string | null
	shipaddress: string | null
	paymentmethods: unknown[]
	isPaypalComplete: boolean
	touchpoints: Touchpoints
	agreetermcondition: boolean
	summary: Summary
	options: {}
}

interface Address {
	fullname?: string | null
	company?: string | null
	addr1: string | null
	addr2: string | null
	addr3: string | null
	city: string | null
	state: string | null
	zip: string | null
	country: string | null
	isvalid: TrueOrFalse
	internalid: string
	phone: string | null
	defaultbilling: TrueOrFalse
	defaultshipping: TrueOrFalse
	isresidential: TrueOrFalse
	addressee?: string | null
	attention?: string | null
}

interface Summary {
	discounttotal_formatted: string
	taxonshipping_formatted: string
	taxondiscount_formatted: string
	itemcount: number
	taxonhandling_formatted: string
	total: number
	tax2total: number
	discountedsubtotal: number
	taxtotal: number
	discounttotal: number
	discountedsubtotal_formatted: string
	taxondiscount: number
	handlingcost_formatted: string
	taxonshipping: number
	taxtotal_formatted: string
	totalcombinedtaxes_formatted: string
	handlingcost: number
	totalcombinedtaxes: number
	giftcertapplied_formatted: string
	shippingcost_formatted: string
	discountrate: number
	taxonhandling: number
	tax2total_formatted: string
	discountrate_formatted: string
	estimatedshipping: number
	subtotal: number
	shippingcost: number
	estimatedshipping_formatted: string
	total_formatted: string
	giftcertapplied: number
	subtotal_formatted: string
}

interface Touchpoints {
	logout: string
	customercenter: string
	serversync: string
	viewcart: string
	login: string
	welcome: string
	checkout: string
	continueshopping: string
	home: string
	register: string
}

interface Language {
	name: string
	isdefault: string
	locale: string
	languagename: string
	url: string
}

interface User {
	firstname: string
	paymentterms: PaymentTerms
	phoneinfo: PhoneInfo
	middlename: string
	vatregistration: string
	creditholdoverride: TrueOrFalse
	lastname: string
	internalid: string
	addressbook: Address[]
	campaignsubscriptions: CampaignSubscription[]
	stage: string
	isperson: boolean
	balance: string
	creditcards: unknown // Not sure of type if present
	companyname: string
	name: string
	emailsubscribe: TrueOrFalse
	creditlimit: string
	email: string
	isLoggedIn: TrueOrFalse
	isRecognized: TrueOrFalse
	isGuest: TrueOrFalse
	priceLevel: string
	subsidiary: string
	language: string
	currency: Currency
	customer: boolean
	customfields: unknown // Not sure of type if present
}

interface CampaignSubscription {
	internalid: number
	subscribed: boolean
	name: string
	description: string | null
}

interface Currency {
	name?: string
	internalid: string
	symbol: string
	currencyname: string
	code: string
	precision?: number
	symbolplacement?: number
}

interface PaymentTerms {
	name: string
	internalid: string
}

interface PhoneInfo {
	fax: string | null
	phone: string | null
	altphone: null
}

export interface ApiItemCategory {
	urls: string[]
	name: string
}

export interface WestanProduct {
	itemimages_detail: {
		urls: { url: string }[]
	}
	onlinecustomerprice_detail: {
		onlinecustomerprice_formatted: string
		onlinecustomerprice: number
	}
	internalid: number
	commercecategory: {
		primarypath: ApiItemCategory[]
		categories: ApiItemCategory[]
	}
	itemid: string
	quantityavailable: number
	pricelevel5: number
	storedisplayname2: string
	pagetitle: string
	urlcomponent: string
	custitem_anx_sca_specifications: string
	custitem_anx_short_description: string
	custitem_anx_sca_description: string
}

export interface ApiResult {
	total: number
	items: WestanProduct[]
	links: {
		rel: 'prev' | 'next'
		href: string
	}[]
}

export interface SpecItem {
	name: string
	value: string
}
export interface SpecHeader {
	is_title: boolean
	name: string
}
export interface DescriptionItem {
	title: string
	body_text: string
	rich_text?: string
}

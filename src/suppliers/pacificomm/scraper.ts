import puppeteer, { Browser, Page } from 'puppeteer'
import { AcquireProduct } from '../..'

const env = process.env.NODE_ENV || 'development'

export const errors = {
	NO_BROWSER: 'Browser not initialized',
	MISSING_CREDENTIALS: 'Missing username or password for Pacificomm',
	LOGIN_FAILED: 'Pacificomm login failed',
	LOGIN_REQUIRED:
		'Not currently logged in. Did you forget to run scraper.login()?',
	INVALID_PRODUCT_BLOCK: 'Invalid product block - skipping',
} as const

const withBrowser = async <T>(fn: (browser: Browser) => T) => {
	const browser = await puppeteer.launch({
		headless: env === 'production',
	})
	try {
		return await fn(browser)
	} finally {
		await browser.close()
	}
}

const withPage =
	(browser: Browser) =>
	async <T>(fn: (page: Page) => T) => {
		const page = await browser.newPage()
		await page.setRequestInterception(true)
		page.on('request', (request) => {
			const requestUrl = request.url()
			if (
				['image', 'stylesheet', 'font', 'media'].includes(
					request.resourceType()
				) ||
				[
					'google-analytics',
					'facebook',
					'twitter',
					'youtube',
					'doubleclick',
					'googletagmanager',
					'googletagservices',
					'googlesyndication',
				].some((source) => requestUrl.includes(source))
			) {
				request.abort()
			} else request.continue()
		})
		try {
			return await fn(page)
		} finally {
			await page.close()
		}
	}

const calculateStock = (stockText: string) => {
	const maxStock = /(\d+)\D*$/.exec(stockText)?.[1]
	return maxStock ?? 0
}

const getImageUrl = (src: string | null) => {
	if (!src) return ''
	return src.includes('blank.jpg') ? '' : src
}

const scrapeProductPage = async (
	page: Page
): Promise<Omit<AcquireProduct, 'manufacturerCode'>> => {
	console.log(`Scraping product page ${page.url()}`)
	const $prodName = await page.$('.prod-name')
	const $prodPrice = await page.$('.prod-price')
	const $prodDescription = await page.$('.prod-description')
	return {
		name: (await $prodName?.$eval('h2', (el) => el.textContent?.trim())) || '',
		brand: (await $prodName?.$eval('a', (el) => el.textContent?.trim())) || '',
		buy:
			(await $prodPrice?.$eval(
				'tr:nth-of-type(4) h1',
				(el) => /\$([\d.]+)/.exec(el.textContent || '')?.[1]
			)) || 0,
		rrp:
			(await $prodPrice?.$eval(
				'tr:nth-of-type(2) h1',
				(el) => /\$([\d.]+)/.exec(el.textContent || '')?.[1]
			)) || 0,
		gtin:
			(await $prodDescription?.$eval(
				'tr:nth-of-type(5) td',
				(el) => /[\d]+/.exec(el.textContent || '')?.[0]
			)) || '',
		supplierCode:
			(await $prodDescription?.$eval(
				'tr:nth-of-type(6) td',
				(el) => /[\d]+/.exec(el.textContent || '')?.[0]
			)) || '',
		supplierUrl: page.url(),
		stock: await $prodPrice?.$eval('tr:nth-of-type(5)', (el) =>
			calculateStock(el.textContent?.trim() || '')
		),
		imageUrl: await page.$eval('.imagestandard', (el) =>
			getImageUrl(el.getAttribute('src'))
		),
	}
}

const getCodeFromItemBlock = (block: Element) => {
	const regex = /"Normalsm"\s*>(\S+)\s*<\/p>/
	const commentText =
		Array.from(
			block.querySelector('tr:nth-of-type(2) > td')?.childNodes || []
		).find((node) => node.nodeType === Node.COMMENT_NODE)?.textContent || ''
	return regex.exec(commentText)?.[1] || ''
}
const getPathFromItemBlock = (block: Element) => {
	return block.querySelector('a')?.getAttribute('href') || ''
}

const scrapeProductFromItemBlock = async (
	browser: Browser,
	block: Element
): Promise<AcquireProduct> => {
	const code = getCodeFromItemBlock(block)
	const url = getPathFromItemBlock(block)
	if (!code || !url) {
		throw new Error(errors.INVALID_PRODUCT_BLOCK)
	}
	console.log(`found product ${code} at ${url}`)
	return withPage(browser)(async (page) => {
		await page.goto(url)
		const scrapedProduct = await scrapeProductPage(page)
		return { ...scrapedProduct, manufacturerCode: code }
	})
}

const login = async (
	browser: Browser,
	options?: { username?: string; password?: string }
) => {
	const username = options?.username || process.env.PACIFICOMM_USERNAME
	const password = options?.password || process.env.PACIFICOMM_PASSWORD
	if (!username || !password) {
		throw new Error(errors.MISSING_CREDENTIALS)
	}
	try {
		await withPage(browser)(async (page) => {
			await page.goto('https://www.pacificomm.co.nz/login')
			await page.type('.DNNspotUserName', username)
			await page.type('.DNNspotPassword', password)
			const [response] = await Promise.all([
				page.waitForNavigation(),
				page.click('input[name*="LoginButton"]'),
			])
			if (!response?.url().includes('store')) {
				throw new Error(errors.LOGIN_FAILED)
			}
		})
	} catch (error) {
		throw new Error(errors.LOGIN_FAILED)
	}
}

export const scrapeAllProducts = () =>
	withBrowser(async (browser) => {
		let products: AcquireProduct[] = []
		await login(browser)
		await withPage(browser)(async (page) => {
			await page.goto('https://www.pacificomm.co.nz/newproductlist.aspx')
			// await page.waitForSelector('.item-block')
			const newProducts = await page.$$eval('.item-block', async (blocks) => {
				const firstProduct = await scrapeProductFromItemBlock(
					browser,
					blocks[0]
				)
				return [firstProduct]
				// const scrapedProducts = blocks.map((block) => {
				// 	const scrapedProduct = scrapeProductFromItemBlock(browser, block)
				// 	return scrapedProduct
				// })
				// return Promise.all(scrapedProducts)
			})
			products = [...products, ...newProducts]
			//TODO: pagination
		})
		return products
	})

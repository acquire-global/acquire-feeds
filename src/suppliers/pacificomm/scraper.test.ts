import { errors, scrapeAllProducts } from './scraper'
import { Page } from 'puppeteer'

// describe('Pacificomm scraper', () => {
// 	test('init runs without failing', async () => {
// 		await expect(scraper.init()).resolves.not.toThrow()
// 	})
// 	// TODO: Test that login fails when username and password are incorrect
// 	test('login fails with incorrect credentials', async () => {
// 		await expect(scraper.login('incorrect', 'incorrect')).rejects.toThrow(
// 			errors.LOGIN_FAILED
// 		)
// 	}, 10000)
// 	test('login fails when no credentials are provided', async () => {
// 		const oldEnv = process.env
// 		process.env = {
// 			...oldEnv,
// 			PACIFICOMM_USERNAME: undefined,
// 			PACIFICOMM_PASSWORD: undefined,
// 		}
// 		await expect(scraper.login()).rejects.toThrow(errors.MISSING_CREDENTIALS)
// 		process.env = oldEnv
// 	}, 10000)
// 	test('login succeeds with correct credentials', () => {
// 		expect(scraper.login()).resolves.toBeInstanceOf(Page)
// 	}, 10000)
// })

describe('Pacificomm product scraper', () => {
	test('scrapeAllProducts runs without failing', async () => {
		const products = await scrapeAllProducts()
		expect(products).toBeInstanceOf(Array)
		expect(products.length).toBeGreaterThan(0)
	}, 30000)
})

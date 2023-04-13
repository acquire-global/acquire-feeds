import convertToCsv, { Errors } from '.'
import { AcquireProduct } from '..'

describe('convertToCsv', () => {
	test(`[] should return ''`, () => {
		expect(convertToCsv([])).toStrictEqual('')
	})

	test('[1,2,3] should return csv with single column and no headers', () => {
		expect(convertToCsv([1, 2, 3])).toEqual(`1\n2\n3`)
	})

	test('Array of mixed element types should return an error', () => {
		expect(() => convertToCsv([{}, '2', 3])).toThrowError(Errors.INVALID_TYPES)
	})

	test('Array of objects should return csv with headers and values', () => {
		expect(
			convertToCsv([
				{ a: 1, b: 2, c: 3 },
				{ a: 4, b: 5, c: 6 },
			])
		).toEqual(`"a","b","c"\n1,2,3\n4,5,6`)
	})

	it('should escape strings', () => {
		expect(
			convertToCsv([
				{ a: '1', b: '2', c: '3' },
				{ a: '4', b: '5', c: '6' },
			])
		).toEqual(`"a","b","c"\n"1","2","3"\n"4","5","6"`)
	})

	it('should escape strings containing double quotes', () => {
		expect(
			convertToCsv([
				{ a: 'double"quote' },
				{ a: 'double""double""quote' },
				{ a: '"double""double""double""quote"' },
			])
		).toEqual(
			`"a"\n"double""quote"\n"double""""double""""quote"\n"""double""""double""""double""""quote"""`
		)
	})

	it('should escape double quotes in headers', () => {
		expect(convertToCsv([{ 'double"quote': 1 }])).toEqual(`"double""quote"\n1`)
	})

	it('should accept an AcquireProduct array', () => {
		const acquireProduct: AcquireProduct = {
			brand: 'brand',
			manufacturerCode: 'manufacturerCode',
			name: 'name',
			buy: 'buy',
			stock: 'stock',
			rrp: 'rrp',
			description: 'description',
		}
		expect(convertToCsv([acquireProduct])).toEqual(
			`"brand","manufacturerCode","name","buy","stock","rrp","description"\n"brand","manufacturerCode","name","buy","stock","rrp","description"`
		)
	})

	it('should throw an error when given an array of objects with different optional keys', () => {
		type OptionalKeys = { a: number; b?: number; c?: number }
		const testArray = [
			{ a: 1, b: 2 },
			{ a: 3, c: 4 },
		] as OptionalKeys[]

		expect(() => convertToCsv(testArray)).toThrowError(Errors.INVALID_TYPES)
	})
})

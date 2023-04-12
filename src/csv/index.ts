export enum Errors {
	INVALID_TYPES = 'Array of invalid types passed to convertToCsv',
}

function escapeString(str: string) {
	return str.length ? `"${str.replace(/"/g, '""')}"` : null
}

type BasicType = string | number | boolean

export default function convertToCsv<
	ItemType extends BasicType | Record<string, BasicType | null>
>(items: ItemType[]): string {
	// Handle empty array
	if (items.length === 0) {
		return ''
	}

	// Handle array of primitive values
	if (items.every((item) => typeof item !== 'object')) {
		return items.join('\n')
	}

	// Ensure items are all objects
	if (items.every((item) => typeof item === 'object')) {
		let csv = Object.keys(items[0]).map(escapeString).join(',')
		items.forEach((item) => {
			csv +=
				'\n' +
				Object.values(item)
					.map((value) => {
						if (typeof value === 'string') {
							return escapeString(value)
						} else return value
					})
					.join(',')
		})
		return csv
	} else {
		throw new Error(Errors.INVALID_TYPES)
	}
}

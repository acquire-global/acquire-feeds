export enum Errors {
	INVALID_TYPES = 'Array of invalid types passed to convertToCsv',
}

function escapeString(str: string) {
	return str.length ? `"${str.replace(/"/g, '""')}"` : null
}

type BasicType = string | number | boolean
type SimpleObjectOfType<T> = Partial<
	Record<keyof T, BasicType | null | undefined>
>

function isBasicType(item: unknown): item is BasicType {
	return (
		typeof item === 'string' ||
		typeof item === 'number' ||
		typeof item === 'boolean'
	)
}

export default function convertToCsv<
	ItemType extends BasicType | SimpleObjectOfType<ItemType>
>(items: ItemType[]): string {
	// Handle empty array
	if (items.length === 0) {
		return ''
	}

	// Handle array of primitive values
	if (items.every((item) => isBasicType(item))) {
		return items.join('\n')
	}

	// Ensure items are all objects with identical keys
	if (
		items.every(
			(item) =>
				typeof item === 'object' &&
				Object.keys(item).every((key) => Object.keys(items[0]).includes(key))
		)
	) {
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

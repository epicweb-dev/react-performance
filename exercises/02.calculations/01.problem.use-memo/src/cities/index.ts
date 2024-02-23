import { matchSorter } from 'match-sorter'
import cities from './us-cities.json'

const allItems = cities.map((city, index) => ({
	...city,
	id: String(index),
}))

export function searchItems(filter: string) {
	return matchSorter(allItems, filter, { keys: ['name'] })
}

export function getById(id: string) {
	return allItems.find(item => item.id === id)
}

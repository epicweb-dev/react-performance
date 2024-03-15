// 💣 delete this file
import { matchSorter } from 'match-sorter'
import cities from './us-cities.json'

const allCities = cities.map((city, index) => ({ ...city, id: String(index) }))

export function searchCities(filter: string) {
	return matchSorter(allCities, filter, { keys: ['name'] })
}

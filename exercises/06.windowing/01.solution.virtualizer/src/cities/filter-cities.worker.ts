import * as Comlink from 'comlink'
import { matchSorter } from 'match-sorter'
import cities from './us-cities.json'

const allCities = cities.map((city, index) => ({ ...city, id: String(index) }))

export async function searchCities(input: string) {
	return matchSorter(allCities, input, { keys: ['name'] })
}

const exposed = { searchCities }
Comlink.expose(exposed)
export type Exposed = typeof exposed

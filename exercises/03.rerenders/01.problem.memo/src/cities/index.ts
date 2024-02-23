import * as Comlink from 'comlink'
import { type Exposed } from './filter-cities.worker'

const worker = new Worker(
	new URL('./filter-cities.worker.ts', import.meta.url),
	{ type: 'module' },
)

const filterCities = Comlink.wrap<Exposed>(worker)

export async function searchCities(input: string) {
	return filterCities.searchCities(input)
}

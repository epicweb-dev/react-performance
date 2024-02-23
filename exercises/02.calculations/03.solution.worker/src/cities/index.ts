import * as Comlink from 'comlink'
import { type searchItems as searchItemsWorker } from './filter-cities.worker'

const worker = new Worker(
	new URL('./filter-cities.worker.ts', import.meta.url),
	{ type: 'module' },
)

type WorkerAPI = {
	searchItems: typeof searchItemsWorker
}

const filterCities = Comlink.wrap<WorkerAPI>(worker)

export async function searchItems(input: string) {
	return filterCities.searchItems(input)
}

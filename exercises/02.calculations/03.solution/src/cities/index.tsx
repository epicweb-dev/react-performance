import { makeWorkerApi } from './worker-api'
import { type City } from './worker-filter-cities'

const worker = new Worker(
	new URL('./worker-filter-cities.ts', import.meta.url),
	{ type: 'module' },
)

const sendWorkerMessage = makeWorkerApi(worker)

export async function searchItems(input: string) {
	const results = await sendWorkerMessage({ type: 'search', args: [input] })
	return results as Array<City>
}

export async function getItemById(id: string) {
	const result = await sendWorkerMessage({ type: 'getById', args: [id] })
	return result as City
}

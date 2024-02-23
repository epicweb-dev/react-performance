import { matchSorter } from 'match-sorter'
import cities from './us-cities.json'
import { makeWorkerMessageHandler } from './worker-api'

const allItems = cities.map((city, index) => ({ ...city, id: String(index) }))
export type City = (typeof allItems)[number]

self.onmessage = makeWorkerMessageHandler(async (input: string) => {
	// 🦉 this is just to simulate a slower device or slightly more intense computation
	await new Promise(resolve => setTimeout(resolve, 100))
	return matchSorter(allItems, input, { keys: ['name'] }).slice(0, 500)
})

self.onerror = function handleWorkerError(event) {
	console.error('An error occurred in the web worker:', event)
}

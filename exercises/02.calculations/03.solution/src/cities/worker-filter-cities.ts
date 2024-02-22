import { matchSorter } from 'match-sorter'
import cities from './us-cities.json'

const allItems = cities.map((city, index) => ({ ...city, id: String(index) }))
export type City = (typeof allItems)[number]

function searchItems(filter: string) {
	return matchSorter(allItems, filter, { keys: ['name'] }).slice(0, 500)
}

function getById(id: string) {
	return allItems.find(item => item.id === id)
}

self.onmessage = function handleWorkerMessage(event) {
	if (!event.data) return
	const { messageId, type, args } = event.data
	const input = args[0]
	if (typeof messageId !== 'string' || typeof input !== 'string') return
	let result = null
	switch (type) {
		case 'search': {
			result = searchItems(input)
			break
		}
		case 'getById': {
			result = getById(input)
			break
		}
	}
	self.postMessage({ messageId, result })
}

self.onerror = function handleWorkerError(event) {
	console.error('An error occurred in the web worker:', event)
}

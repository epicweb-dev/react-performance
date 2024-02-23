import * as Comlink from 'comlink'
import { matchSorter } from 'match-sorter'
import cities from './us-cities.json'

const allItems = cities.map((city, index) => ({ ...city, id: String(index) }))
export type City = (typeof allItems)[number]

export function searchItems(input: string) {
	return matchSorter(allItems, input, { keys: ['name'] }).slice(0, 500)
}

Comlink.expose({ searchItems })

// 🐨 move all this to a new file at ./filter-cities.worker.ts 👇
import { matchSorter } from 'match-sorter'
import cities from './us-cities.json'

const allCities = cities.map((city, index) => ({ ...city, id: String(index) }))

export function searchCities(filter: string) {
	return matchSorter(allCities, filter, { keys: ['name'] })
}
// 🐨 move all that to a new file at ./filter-cities.worker.ts 👆

// 🐨 🛑 finish the instructions in ./filter-cities.worker.ts before continuing here...

// 🐨 you're going to want this:
// import * as Comlink from 'comlink'
// 🐨 import the Exposed type from './filter-cities.worker'

// 🐨 create a new Worker object out of the ./filter-cities.worker.ts module

// 🐨 create a filterCities object by calling Comlink.wrap with the worker
// 🦺 you can use the Exposed type as the generic for some type safety

// 🐨 export a new searchCities that calls the filterCities.searchCities API with a given input

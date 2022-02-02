import {matchSorter} from 'match-sorter'
import citiesData from './us-cities.json'

const cities = citiesData

const allItems = cities.map((city, index) => ({
  ...city,
  id: String(index),
}))

// for some reason workerize doesn't like export {getItems}
// but it's fine with inline exports like this so that's what we're doing.
export function getItems(filter: string) {
  if (!filter) {
    return allItems
  }
  return matchSorter(allItems, filter, {
    keys: ['name'],
  })
}

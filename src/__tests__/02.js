import React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import {getItems} from '../filter-cities'
import App from '../final/02'
// import App from '../exercise/02'

jest.mock('../filter-cities', () => {
  const filterCities = jest.requireActual('../filter-cities')
  return {
    ...filterCities,
    getItems: jest.fn((...args) => filterCities.getItems(...args)),
  }
})

test('useMemo is called properly', () => {
  const {container} = render(<App />)
  const forceRerender = screen.getByText(/force rerender/i)

  expect(
    getItems,
    'The Menu component must call getItems with the inputValue.',
  ).toHaveBeenCalledWith('')

  getItems.mockClear()
  const findCity = screen.getByRole('textbox', {name: /find a city/i})
  const filter = 'NO_CITY_WILL_MATCH_THIS'
  fireEvent.change(findCity, {target: {value: filter}})

  expect(
    container.querySelectorAll('li'),
    `There are search results when there shouldn't be. Make sure to pass the inputValue into the dependecy array of the useMemo call. If you're doing that correctly, then make sure that you're calling the getItems function correctly.`,
  ).toHaveLength(0)
  expect(getItems).toHaveBeenCalledWith(filter)
  expect(
    getItems,
    'getItems was called even though the inputValue was unchanged. Make sure to wrap it in useMemo with the inputValue as a dependency.',
  ).toHaveBeenCalledTimes(1)

  getItems.mockClear()
  fireEvent.click(forceRerender)
  expect(
    getItems,
    'getItems was called even though the inputValue was unchanged. Make sure to wrap it in useMemo with the inputValue as a dependency.',
  ).toHaveBeenCalledTimes(0)
})

import React from 'react'
import {render, fireEvent, waitFor, screen} from '@testing-library/react'
import {getItems} from '../workerized-filter-cities'
import App from '../final/02.extra-1'
// import App from '../exercise/02'

jest.mock('react', () => {
  const actualReact = jest.requireActual('react')
  return {
    ...actualReact,
    useMemo: jest.fn((...args) => actualReact.useMemo(...args)),
  }
})

jest.mock('../workerized-filter-cities', () => ({
  getItems: jest.fn(() => {
    throw new Error('getItems must be mocked')
  }),
}))

test('useMemo is called properly', async () => {
  const promise = Promise.resolve([{id: 'fake', name: 'FAKE_CITY_NAME'}])
  getItems.mockReturnValue(promise)
  const {getByText, container} = render(<App />)
  const forceRerender = getByText(/force rerender/i)

  await waitFor(() => promise)

  const findCity = screen.getByRole('textbox', {name: /find a city/i})
  const filter = 'NO_CITY_WILL_MATCH_THIS'
  const promise2 = Promise.resolve([])
  getItems.mockReturnValue(promise2)

  fireEvent.change(findCity, {target: {value: filter}})

  await waitFor(() => promise2)

  expect(
    container.querySelectorAll('li'),
    `There are search results when there shouldn't be. Make sure to pass the inputValue into the dependecy array of the useMemo call. If you're doing that correctly, then make sure that you're calling the getItems function correctly.`,
  ).toHaveLength(0)

  fireEvent.click(forceRerender)
  await waitFor(() => promise2)
  expect(React.useMemo).not.toHaveBeenCalled()
})

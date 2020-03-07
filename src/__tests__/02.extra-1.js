import React from 'react'
import chalk from 'chalk'
import {render, fireEvent, wait} from '@testing-library/react'
import {getItems} from '../workerized-filter-cities'
import Usage from '../final/02.extra-1'
// import Usage from '../exercise/02'

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
  const {getByText, container} = render(<Usage />)
  const forceRerender = getByText(/force rerender/i)

  await wait(() => promise)

  const findCity = container.querySelector('input')
  const filter = 'NO_CITY_WILL_MATCH_THIS'
  const promise2 = Promise.resolve([])
  getItems.mockReturnValue(promise2)

  fireEvent.change(findCity, {target: {value: filter}})

  await wait(() => promise2)

  try {
    expect(container.querySelectorAll('li')).toHaveLength(0)
  } catch (error) {
    //
    //
    //
    // these comment lines are just here to keep the next line out of the codeframe
    // so it doesn't confuse people when they see the error message twice.
    error.message = `🚨  ${chalk.red(
      `There are search results when there shouldn't be. Make sure to pass the inputValue into the dependecy array of the useMemo call. If you're doing that correctly, then make sure that you're calling the getItems function correctly.`,
    )}\n\n${error.message}`

    throw error
  }

  fireEvent.click(forceRerender)
  await wait(() => promise2)
  expect(React.useMemo).not.toHaveBeenCalled()
})

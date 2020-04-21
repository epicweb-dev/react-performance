import React from 'react'
import chalk from 'chalk'
import {render, fireEvent} from '@testing-library/react'
import App from '../final/02'
// import App from '../exercise/02'

jest.mock('react', () => {
  const actualReact = jest.requireActual('react')
  return {
    ...actualReact,
    useMemo: jest.fn((...args) => actualReact.useMemo(...args)),
  }
})

test('useMemo is called properly', () => {
  const {getByText, container} = render(<App />)
  const forceRerender = getByText(/force rerender/i)

  try {
    expect(React.useMemo).toHaveBeenCalledTimes(1)
    expect(React.useMemo).toHaveBeenCalledWith(expect.any(Function), [''])
  } catch (error) {
    //
    //
    //
    // these comment lines are just here to keep the next line out of the codeframe
    // so it doesn't confuse people when they see the error message twice.
    error.message = `🚨  ${chalk.red(
      'The Menu component must call React.useMemo with a function that calls getItems(inputValue) and an array with the inputValue.',
    )}\n\n${error.message}`

    throw error
  }

  React.useMemo.mockClear()
  const findCity = container.querySelector('input')
  const filter = 'NO_CITY_WILL_MATCH_THIS'
  fireEvent.change(findCity, {target: {value: filter}})

  try {
    expect(container.querySelectorAll('li')).toHaveLength(0)
    expect(React.useMemo).toHaveBeenCalledTimes(1)
    expect(React.useMemo).toHaveBeenCalledWith(expect.any(Function), [filter])
  } catch (error) {
    //
    //
    //
    // these comment lines are just here to keep the next line out of the codeframe
    // so it doesn't confuse people when they see the error message twice.
    error.message = `🚨  ${chalk.red(
      `There are search results when there shouldn't be. Make sure to pass the inputValue into the dependecy array of the useMemo call. If you're doing that correctly, then make sure that you're calling the getItems function correctly.`,
    )}`

    throw error
  }

  React.useMemo.mockClear()
  fireEvent.click(forceRerender)
  expect(React.useMemo).toHaveBeenCalledTimes(1)
  expect(React.useMemo).toHaveBeenCalledWith(expect.any(Function), [filter])
})

import React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
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
  const {container} = render(<App />)
  const forceRerender = screen.getByText(/force rerender/i)

  expect(
    React.useMemo,
    'The Menu component must call React.useMemo with a function that calls getItems(inputValue) and an array with the inputValue.',
  ).toHaveBeenCalledWith(expect.any(Function), [''])

  React.useMemo.mockClear()
  const findCity = screen.getByRole('textbox', {name: /find a city/i})
  const filter = 'NO_CITY_WILL_MATCH_THIS'
  fireEvent.change(findCity, {target: {value: filter}})

  expect(
    container.querySelectorAll('li'),
    `There are search results when there shouldn't be. Make sure to pass the inputValue into the dependecy array of the useMemo call. If you're doing that correctly, then make sure that you're calling the getItems function correctly.`,
  ).toHaveLength(0)
  expect(React.useMemo).toHaveBeenCalledWith(expect.any(Function), [filter])

  React.useMemo.mockClear()
  fireEvent.click(forceRerender)
  expect(React.useMemo).toHaveBeenCalledTimes(1)
  expect(React.useMemo).toHaveBeenCalledWith(expect.any(Function), [filter])
})

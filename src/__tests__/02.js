import * as React from 'react'
import {alfredTip} from '@kentcdodds/react-workshop-app/test-utils'
import {render, screen, fireEvent} from '@testing-library/react'
import {getItems} from '../filter-cities'
import App from '../final/02'
// import App from '../exercise/02'

jest.mock('../filter-cities')

beforeEach(() => {
  const filterCities = jest.requireActual('../filter-cities')
  getItems.mockImplementation((...args) => {
    return filterCities.getItems(...args)
  })
})

test('useMemo is called properly', async () => {
  const {container} = render(<App />)
  const forceRerender = screen.getByText(/force rerender/i)

  alfredTip(
    () => expect(getItems).toHaveBeenCalledWith(''),
    'The Menu component must call getItems with the inputValue.',
  )

  getItems.mockClear()
  const findCity = screen.getByRole('textbox', {name: /find a city/i})
  const filter = 'NO_CITY_WILL_MATCH_THIS'
  // using fireEvent because we only want 1 change event/re-render here
  fireEvent.change(findCity, {target: {value: filter}})

  alfredTip(
    () => expect(container.querySelectorAll('li')).toHaveLength(0),
    `There are search results when there shouldn't be. Make sure to pass the inputValue into the dependecy array of the useMemo call. If you're doing that correctly, then make sure that you're calling the getItems function correctly.`,
  )
  expect(getItems).toHaveBeenCalledWith(filter)
  alfredTip(
    () => expect(getItems).toHaveBeenCalledTimes(1),
    'getItems was called even though the inputValue was unchanged. Make sure to wrap it in useMemo with the inputValue as a dependency.',
  )

  getItems.mockClear()
  // using fireEvent because we do not want to blur the input
  // because downshift will set the input value to an empty string
  // on blur.
  fireEvent.click(forceRerender)
  alfredTip(
    () => expect(getItems).toHaveBeenCalledTimes(0),
    'getItems was called even though the inputValue was unchanged. Make sure to wrap it in useMemo with the inputValue as a dependency.',
  )
})

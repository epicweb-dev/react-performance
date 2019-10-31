import React from 'react'
import {_FixedSizeList as List} from 'react-window'
import chalk from 'chalk'
import {render, fireEvent, wait} from '@testing-library/react'
import {getItems} from '../workerized-filter-cities'
import Usage from '../exercises-final/04'
// import Usage from '../exercises/04'

jest.mock('react-window', () => {
  const {forwardRef} = require('react')
  const {FixedSizeList: ListComp} = jest.requireActual('react-window')
  const mockComp = jest.fn((props, ref) => <ListComp ref={ref} {...props} />)
  return {
    _FixedSizeList: mockComp,
    FixedSizeList: forwardRef(mockComp),
  }
})

jest.mock('../workerized-filter-cities', () => ({
  getItems: jest.fn(() => {
    throw new Error('getItems must be mocked')
  }),
}))

test('renders react-window properly', async () => {
  const fakeCity = {id: 'fake', name: 'FAKE_CITY_NAME'}
  const fakeItems = [fakeCity]
  const promise = Promise.resolve(fakeItems)
  getItems.mockReturnValue(promise)
  const {getByText} = render(<Usage />)

  await wait(() => promise)

  try {
    expect(List).toHaveBeenLastCalledWith(
      expect.objectContaining({
        children: expect.any(Function),
        height: 300,
        width: 300,
        itemSize: 20,
        itemCount: 1,
        itemData: expect.objectContaining({
          getItemProps: expect.any(Function),
          highlightedIndex: null,
          items: fakeItems,
          selectedItem: null,
        }),
      }),
      expect.any(Object),
    )
  } catch (error) {
    //
    //
    //
    // these comment lines are just here to keep the next line out of the codeframe
    // so it doesn't confuse people when they see the error message twice.
    error.message = `🚨  ${chalk.red(
      'The Menu component must render the List component with the correct props',
    )}\n\n${error.message}`

    throw error
  }

  fireEvent.click(getByText(fakeCity.name))
  await wait(() => expect(window.alert).toHaveBeenCalledTimes(1))
  expect(window.alert).toHaveBeenCalledWith(
    expect.stringContaining(fakeCity.name),
  )

  expect(List).toHaveBeenLastCalledWith(
    expect.objectContaining({
      children: expect.any(Function),
      height: 300,
      width: 300,
      itemSize: 20,
      itemCount: 1,
      itemData: expect.objectContaining({
        getItemProps: expect.any(Function),
        highlightedIndex: null,
        items: fakeItems,
        selectedItem: fakeCity,
      }),
    }),
    expect.any(Object),
  )
})

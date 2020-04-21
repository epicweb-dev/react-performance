import React from 'react'
import {_FixedSizeList as List} from 'react-window'
import {render, fireEvent, waitFor, screen} from '@testing-library/react'
import {getItems} from '../workerized-filter-cities'
import App from '../final/04'
// import App from '../exercise/04'

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
  render(<App />)

  await waitFor(() => promise)

  expect(
    List,
    'The Menu component must render the List component with the correct props',
  ).toHaveBeenLastCalledWith(
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

  fireEvent.click(screen.getByText(fakeCity.name))
  await waitFor(() => expect(window.alert).toHaveBeenCalledTimes(1))
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

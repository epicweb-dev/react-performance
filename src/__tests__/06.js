import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../final/06'
// import App from '../exercise/06'

beforeEach(() => {
  jest.spyOn(React, 'useState')
  jest.spyOn(React, 'useReducer')
})

test('colocates state properly', () => {
  render(<App />)

  expect(
    React.useReducer,
    'React.useReducer should not be called with an initial state object value that includes a dogName property',
  ).not.toHaveBeenCalledWith(
    expect.any(Function),
    expect.objectContaining({dogName: expect.anything()}),
  )

  const [appReducer] = React.useReducer.mock.calls.find(
    ([fn, init]) => init.grid,
  )
  expect(
    appReducer,
    `Unable to find the appReducer function. Ask the instructor what's going on. You shouldn't see this.`,
  ).toBeInstanceOf(Function)

  expect(
    () => appReducer({}, {type: 'TYPED_IN_DOG_INPUT'}),
    `The appReducer shouldn't handle the event type TYPED_IN_DOG_INPUT anymore`,
  ).toThrow(/TYPED_IN_DOG_INPUT/i)

  const testDogName = 'TEST_DOG_NAME'
  userEvent.type(screen.getByLabelText(/dog name/i), testDogName)
  expect(
    screen.getByText(testDogName),
    'The DogName component is not working.',
  ).toBeInTheDocument()
})

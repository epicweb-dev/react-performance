import React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import App from '../final/05'
// import App from '../exercise/05'

jest.mock('react', () => {
  const actualReact = jest.requireActual('react')
  return {
    ...actualReact,
    useState: jest.fn((...args) => actualReact.useState(...args)),
    useReducer: jest.fn((...args) => actualReact.useReducer(...args)),
  }
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
  fireEvent.change(screen.getByLabelText(/dog name/i), {
    target: {value: testDogName},
  })
  expect(
    screen.getByText(testDogName),
    'The DogName component is not working.',
  ).toBeInTheDocument()
})

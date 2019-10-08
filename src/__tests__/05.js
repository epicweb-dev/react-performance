import React from 'react'
import chalk from 'chalk'
import {render, fireEvent} from '@testing-library/react'
import Usage from '../exercises-final/05'
// import Usage from '../exercises/05'

jest.mock('react', () => {
  const actualReact = jest.requireActual('react')
  return {
    ...actualReact,
    useState: jest.fn((...args) => actualReact.useState(...args)),
    useReducer: jest.fn((...args) => actualReact.useReducer(...args)),
  }
})

test('colocates state properly', () => {
  const {getByLabelText, getByText} = render(<Usage />)

  try {
    expect(React.useReducer).not.toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({dogName: expect.anything()}),
    )
  } catch (error) {
    //
    //
    //
    // these comment lines are just here to keep the next line out of the codeframe
    // so it doesn't confuse people when they see the error message twice.
    error.message = `🚨  ${chalk.red(
      'React.useReducer should not be called with an initial state object value that includes a dogName property',
    )}\n\n${error.message}`

    throw error
  }

  let appReducer
  try {
    ;[appReducer] = React.useReducer.mock.calls.find(([fn, init]) => init.grid)
    expect(appReducer).toBeInstanceOf(Function)
  } catch (error) {
    //
    //
    //
    // these comment lines are just here to keep the next line out of the codeframe
    // so it doesn't confuse people when they see the error message twice.
    error.message = `🚨  ${chalk.red(
      `Unable to find the appReducer function. Ask the instructor what's going on. You shouldn't see this.`,
    )}\n\n${error.message}`

    throw error
  }

  try {
    expect(() => appReducer({}, {type: 'TYPED_IN_DOG_INPUT'})).toThrow(
      /TYPED_IN_DOG_INPUT/i,
    )
  } catch (error) {
    //
    //
    //
    // these comment lines are just here to keep the next line out of the codeframe
    // so it doesn't confuse people when they see the error message twice.
    error.message = `🚨  ${chalk.red(
      `The appReducer shouldn't handle the event type TYPED_IN_DOG_INPUT anymore`,
    )}\n\n${error.message}`

    throw error
  }

  try {
    const testDogName = 'TEST_DOG_NAME'
    fireEvent.change(getByLabelText(/dog name/i), {
      target: {value: testDogName},
    })
    expect(getByText(testDogName)).toBeInTheDocument()
  } catch (error) {
    //
    //
    //
    // these comment lines are just here to keep the next line out of the codeframe
    // so it doesn't confuse people when they see the error message twice.
    error.message = `🚨  ${chalk.red(
      'The DogName component is not working.',
    )}\n\n${error.message}`

    throw error
  }
})

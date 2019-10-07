import React from 'react'
import chalk from 'chalk'
import '../exercises-final/03'
// import '../exercises/03'

// this gets set as soon as we import the file
// storing it here so it persists between tests
const memoCalls = [...React.memo.mock.calls]

jest.mock('../workerized-filter-cities', () => ({
  getItems: jest.fn(() => {
    throw new Error('getItems must be mocked')
  }),
}))

jest.mock('react', () => {
  const actualReact = jest.requireActual('react')
  return {
    ...actualReact,
    memo: jest.fn((...args) => actualReact.memo(...args)),
  }
})

test('Components are memoized', () => {
  try {
    expect(memoCalls).toEqual([[expect.any(Function)], [expect.any(Function)]])
  } catch (error) {
    //
    //
    //
    // these comment lines are just here to keep the next line out of the codeframe
    // so it doesn't confuse people when they see the error message twice.
    error.message = `🚨  ${chalk.red(
      'The Menu and ListItem components need to both be wrapped in React.memo. You do not need to have any other components memoized',
    )}`

    throw error
  }
})

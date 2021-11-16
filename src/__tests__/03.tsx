import * as React from 'react'
import chalk from 'chalk'
import '../final/03'
// import '../final/03-extra.1'
// import '../exercise/03'

// this gets set as soon as we import the file
// storing it here so it persists between tests

const isObject = (
  value: unknown,
): value is Record<string | number | symbol, any> => {
  return Object.prototype.toString.call(value) === '[object Object]'
}

const isError = (error: unknown): error is {message: string} => {
  return isObject(error) && 'message' in error
}

const reactMemoMock = jest.spyOn(React, 'memo')

const memoCalls = [...reactMemoMock.mock.calls]

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
  const memoizedFunctions = memoCalls.map(call => call[0].name)
  try {
    expect(memoizedFunctions).toContain('Menu')
    expect(memoizedFunctions).toContain('ListItem')
    if (memoCalls.length > 2) {
      expect(memoizedFunctions).toContain('Downshift')
    }
  } catch (error) {
    if (!isError(error)) return

    //
    //
    //
    // these comment lines are just here to keep the next line out of the codeframe
    // so it doesn't confuse people when they see the error message twice.
    if (memoizedFunctions.length < 2) {
      console.warn(
        `You may be seeing this error because the name of the function was removed (like this: const Menu = React.memo(() => {})). It's avised to keep the function name to improve the devtools experience (like this: const Menu = React.memo(function Menu() {}))`,
      )
    }
    error.message = `🚨  ${chalk.red(
      `The Menu and ListItem components need to both be wrapped in React.memo. You do not need to have any other components memoized.`,
    )}\n\n${error.message}`

    throw error
  }
})

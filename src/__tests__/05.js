import React from 'react'
import chalk from 'chalk'
import {render} from '@testing-library/react'
import App from '../final/05'
// import App from '../exercise/05'

beforeEach(() => {
  jest.spyOn(React, 'useMemo')
})

test('memoizes state properly', () => {
  render(<App />)
  const memoCall = React.useMemo.mock.calls.find(
    ([fn, deps]) => deps && deps.some && deps.some(d => d && d.grid),
  )
  if (!memoCall) {
    throw new Error(
      `🚨  ${chalk.red(
        'AppProvider must call React.useMemo with the state as a dependency',
      )}`,
    )
  }
  const [memoFn, deps] = memoCall
  const [state, dispatch] = memoFn()

  if (!state || !dispatch) {
    throw new Error(
      `🚨  ${chalk.red(
        'The useMemo callback must return an array that includes the state object and dispatch function',
      )}`,
    )
  }

  if (typeof dispatch !== 'function') {
    throw new Error(
      `🚨  ${chalk.red(
        'The second element in the array returned from the useMemo callback must be the dispatch function',
      )}`,
    )
  }

  if (
    !(deps.length === 1 && deps.includes(state)) &&
    !(deps.length === 2 && deps.includes(state) && deps.includes(dispatch))
  ) {
    throw new Error(
      `🚨  ${chalk.red(
        'The useMemo dependency array must be an array that includes only the state (and optionally the dispatch function)',
      )}`,
    )
  }
})

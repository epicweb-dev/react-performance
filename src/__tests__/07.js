import React from 'react'
import chalk from 'chalk'
import {render} from '@testing-library/react'
import reportProfile from '../report-profile'
import App from '../final/07'
// import App from '../exercise/07'

jest.mock('react', () => {
  const actualReact = jest.requireActual('react')
  return {
    ...actualReact,
    Profiler: jest.fn(({children}) => children),
  }
})

test('uses the Profiler correctly', () => {
  render(<App />)

  try {
    expect(React.Profiler).toHaveBeenLastCalledWith(
      {
        children: expect.any(Object),
        id: 'counter',
        onRender: reportProfile,
      },
      expect.any(Object),
    )
  } catch (error) {
    //
    //
    //
    // these comment lines are just here to keep the next line out of the codeframe
    // so it doesn't confuse people when they see the error message twice.
    error.message = `🚨  ${chalk.red(
      'The React.Profiler component must be used with the correct props',
    )}\n\n${error.message}`

    throw error
  }
})

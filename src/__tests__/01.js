import React from 'react'
import chalk from 'chalk'
import {render, fireEvent} from '@testing-library/react'
import Usage from '../final/01'
// import Usage from '../exercise/01'

test('loads the tile component asynchronously', async () => {
  const {getByLabelText, findByDisplayValue, queryByDisplayValue} = render(
    <Usage />,
  )
  fireEvent.click(getByLabelText(/show tilt/))

  const tilted = /this is tilted/i

  try {
    expect(queryByDisplayValue(tilted)).not.toBeInTheDocument()
  } catch (error) {
    //
    //
    //
    // these comment lines are just here to keep the next line out of the codeframe
    // so it doesn't confuse people when they see the error message twice.
    error.message = `🚨  ${chalk.red(
      'The tilt component must be loaded asynchronously via React.lazy and React.Suspense',
    )}`

    throw error
  }

  expect(await findByDisplayValue(tilted)).toBeInTheDocument()
})

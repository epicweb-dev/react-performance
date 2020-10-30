import * as React from 'react'
import {alfredTip} from '@kentcdodds/react-workshop-app/test-utils'
import {render, screen, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../final/01'
// import App from '../exercise/01'

beforeEach(() => {
  window.navigator.geolocation = {
    getCurrentPosition: async () => ({
      coords: {
        logitude: 321,
        latitude: 123,
      },
    }),
  }
})

test('loads the tile component asynchronously', async () => {
  render(<App />)

  alfredTip(
    () => expect(screen.queryByTitle(/globe/i)).not.toBeInTheDocument(),
    'The tilt component must be loaded asynchronously via React.lazy and React.Suspense',
  )

  // TODO: figure out why act is needed here because it should not be...
  await act(async () => {
    userEvent.click(screen.getByLabelText(/show globe/))
  })

  expect(await screen.findByTitle(/globe/i)).toBeInTheDocument()
})

import * as React from 'react'
import {alfredTip} from '@kentcdodds/react-workshop-app/test-utils'
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

  alfredTip(
    () =>
      expect(React.useReducer).not.toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({dogName: expect.anything()}),
      ),
    'React.useReducer should not be called with an initial state object value that includes a dogName property',
  )

  const [appReducer] = React.useReducer.mock.calls.find(
    ([fn, init]) => init.grid,
  )
  alfredTip(
    () => expect(appReducer).toBeInstanceOf(Function),
    `Unable to find the appReducer function. Ask the instructor what's going on. You shouldn't see this.`,
  )

  alfredTip(
    () =>
      expect(() => appReducer({}, {type: 'TYPED_IN_DOG_INPUT'})).toThrow(
        /TYPED_IN_DOG_INPUT/i,
      ),
    `The appReducer shouldn't handle the event type TYPED_IN_DOG_INPUT anymore`,
  )

  const testDogName = 'TEST_DOG_NAME'
  userEvent.type(screen.getByLabelText(/dog name/i), testDogName)
  alfredTip(
    () => expect(screen.getByText(testDogName)).toBeInTheDocument(),
    'The DogName component is not working.',
  )
})

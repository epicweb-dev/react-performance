import React from 'react'
import {render} from '@testing-library/react'
import reportProfile from '../report-profile'
import App from '../final/07'
// import App from '../exercise/07'

jest.mock('react', () => {
  const actualReact = jest.requireActual('react')
  return {
    ...actualReact,
    Profiler: jest.fn(),
  }
})

beforeEach(() => {
  React.Profiler.mockImplementation(({children}) => children)
})

test('uses the Profiler correctly', () => {
  render(<App />)

  expect(
    React.Profiler,
    'The React.Profiler component must be used with the correct props',
  ).toHaveBeenLastCalledWith(
    {
      children: expect.any(Object),
      id: 'counter',
      onRender: reportProfile,
    },
    expect.any(Object),
  )
})

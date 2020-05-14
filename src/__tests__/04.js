import React from 'react'
import {render, waitFor, screen} from '@testing-library/react'
import {build, fake, sequence} from '@jackfranklin/test-data-bot'
import {getItems} from '../workerized-filter-cities'
import App from '../final/04'
// import App from '../exercise/04'

const buildItem = build({
  fields: {
    id: sequence(),
    name: fake(f => f.name.firstName()),
  },
})

jest.mock('../workerized-filter-cities', () => ({
  getItems: jest.fn(() => {
    throw new Error('getItems must be mocked')
  }),
}))

test('windows properly', async () => {
  const fakeItems = Array.from({length: 100}, () => buildItem())
  const promise = Promise.resolve(fakeItems)
  getItems.mockReturnValue(promise)
  render(<App />)

  await waitFor(() => promise)

  expect(
    screen.getAllByRole('option').length,
    `Looks like all of the items are being rendered. Make sure you're using useVirtual and you're mapping over the virtualRows rather than the actual items.`,
  ).toBeLessThan(fakeItems.length)
})

import * as React from 'react'
import {alfredTip} from '@kentcdodds/react-workshop-app/test-utils'
import {render, waitFor, screen} from '@testing-library/react'
import {build, fake, sequence} from '@jackfranklin/test-data-bot'
import {getItems} from '../workerized-filter-cities'
import App from '../final/04'
// import App from '../exercise/04'

type Items = ReturnType<typeof getItems>[0]

const buildItem = build<Items>({
  fields: {
    id: sequence(),
    name: fake(f => f.name.firstName()),
    country: fake(f => f.address.country()),
    lat: sequence(),
    lng: sequence(),
  },
})

jest.mock('../workerized-filter-cities', () => ({
  getItems: jest.fn(() => {
    throw new Error('getItems must be mocked')
  }),
}))

const getItemsMock = jest.spyOn({getItems}, 'getItems')

test('windows properly', async () => {
  const fakeItems = Array.from({length: 100}, () => buildItem())
  const promise = await Promise.resolve(fakeItems)
  getItemsMock.mockReturnValue(promise)
  render(<App />)

  await waitFor(() => promise)

  alfredTip(
    () =>
      expect(screen.getAllByRole('option').length).toBeLessThan(
        fakeItems.length,
      ),
    `Looks like all of the items are being rendered. Make sure you're using useVirtual and you're mapping over the virtualRows rather than the actual items.`,
  )
})

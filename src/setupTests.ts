import '@kentcdodds/react-workshop-app/setup-tests'

let mockedAlert: jest.SpyInstance<void, [message?: any]>

beforeAll(() => {
  mockedAlert = jest.spyOn(window, 'alert').mockImplementation(() => {})
})

beforeEach(() => {
  mockedAlert.mockClear()
})

afterAll(() => {
  mockedAlert.mockClear()
})

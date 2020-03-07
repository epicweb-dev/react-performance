import '@kentcdodds/react-workshop-app/setup-tests'

beforeAll(() => {
  jest.spyOn(window, 'alert').mockImplementation(() => {})
})

beforeEach(() => {
  window.alert.mockClear()
})

afterAll(() => {
  window.alert.mockRestore()
})

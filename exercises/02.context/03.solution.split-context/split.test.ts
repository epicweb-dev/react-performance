import { getComponentCalls } from '#shared/get-component-calls'
import { testStep, expect, dtl } from '@epic-web/workshop-utils/test'

const { screen, fireEvent } = dtl

await import('./index.tsx')

await testStep(
	'FooterSetters should not re-render when footer state changes',
	async () => {
		const colorButton = await screen.findByRole('button', { name: /blue/i })

		const componentNames = await getComponentCalls(async () => {
			fireEvent.click(colorButton)
			await new Promise((resolve) => setTimeout(resolve, 10))
		})

		expect(componentNames).toContain('FooterImpl')
		expect(componentNames).not.toContain('FooterSetters')
	},
)

await testStep(
	'FooterSetters should not re-render when footer name changes',
	async () => {
		const nameInput = await screen.findByLabelText(/name/i)

		const componentNames = await getComponentCalls(async () => {
			fireEvent.change(nameInput, { target: { value: 'New Name' } })
			await new Promise((resolve) => setTimeout(resolve, 10))
		})

		expect(componentNames).toContain('FooterImpl')
		expect(componentNames).not.toContain('FooterSetters')
	},
)

await testStep(
	'FooterSetters should render only once during initial render',
	async () => {
		const componentNames = await getComponentCalls(async () => {
			// Force a re-render of the entire app
			const appCountButton = await screen.findByRole('button', {
				name: /the app count is/i,
			})
			fireEvent.click(appCountButton)
			await new Promise((resolve) => setTimeout(resolve, 10))
		})

		const footerSettersCount = componentNames.filter(
			(name) => name === 'FooterSetters',
		).length

		expect(footerSettersCount).toBe(0)
	},
)

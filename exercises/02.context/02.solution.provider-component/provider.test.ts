import { getComponentCalls } from '#shared/get-component-calls'
import { testStep, expect, dtl } from '@epic-web/workshop-utils/test'

const { screen, fireEvent } = dtl

await import('./index.tsx')

await testStep(
	'changing the app counter should not re-render the Footer component',
	async () => {
		const appCountButton = await screen.findByRole('button', {
			name: /the app count is/i,
		})

		const componentNames = await getComponentCalls(async () => {
			fireEvent.click(appCountButton)
			await new Promise((resolve) => setTimeout(resolve, 10))
		})

		expect(componentNames).toEqual([
			'App',
			'FooterProvider',
			'FooterSetters',
			'Main',
		])
	},
)

await testStep(
	'changing footer color should not re-render App or Main',
	async () => {
		const colorButton = await screen.findByRole('button', { name: /blue/i })

		const componentNames = await getComponentCalls(async () => {
			fireEvent.click(colorButton)
			await new Promise((resolve) => setTimeout(resolve, 10))
		})

		expect(componentNames).toEqual(
			expect.arrayContaining(['FooterSetters', 'FooterImpl', 'FooterProvider']),
		)
		expect(componentNames).not.toContain('App')
		expect(componentNames).not.toContain('Main')
	},
)

await testStep(
	'changing footer name should not re-render App or Main',
	async () => {
		const nameInput = await screen.findByLabelText(/name/i)

		const componentNames = await getComponentCalls(async () => {
			fireEvent.change(nameInput, { target: { value: 'New Name' } })
			await new Promise((resolve) => setTimeout(resolve, 10))
		})

		expect(componentNames).toEqual(
			expect.arrayContaining(['FooterSetters', 'FooterImpl', 'FooterProvider']),
		)
		expect(componentNames).not.toContain('App')
		expect(componentNames).not.toContain('Main')
	},
)

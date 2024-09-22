import { getComponentCalls } from '#shared/get-component-calls'
import { testStep, expect, dtl } from '@epic-web/workshop-utils/test'

const { screen, fireEvent } = dtl

await import('./index.tsx')

await testStep(
	'changing the app counter should not re-render the Footer component',
	async () => {
		// Find the app count button
		const appCountButton = await screen.findByRole('button', {
			name: /the app count is/i,
		})

		// Get the component calls when clicking the app count button
		const componentNames = await getComponentCalls(async () => {
			fireEvent.click(appCountButton)
			// Give components time to render
			await new Promise((resolve) => setTimeout(resolve, 10))
		})

		expect(componentNames).toEqual(['App', 'FooterSetters', 'Main'])
	},
)

await testStep('changing footer color should re-render Footer', async () => {
	// Find the color button
	const colorButton = await screen.findByRole('button', { name: /blue/i })

	// Get the component calls when changing the color
	const componentNames = await getComponentCalls(async () => {
		fireEvent.click(colorButton)
		// Give components time to render
		await new Promise((resolve) => setTimeout(resolve, 10))
	})

	expect(componentNames).toEqual(
		expect.arrayContaining(['App', 'FooterSetters', 'Main', 'FooterImpl']),
	)
})

await testStep('changing footer name should re-render Footer', async () => {
	// Find the name input
	const nameInput = await screen.findByLabelText(/name/i)

	// Get the component calls when changing the name
	const componentNames = await getComponentCalls(async () => {
		fireEvent.change(nameInput, { target: { value: 'New Name' } })
		// Give components time to render
		await new Promise((resolve) => setTimeout(resolve, 10))
	})

	expect(componentNames).toEqual(
		expect.arrayContaining(['App', 'FooterSetters', 'Main', 'FooterImpl']),
	)
})

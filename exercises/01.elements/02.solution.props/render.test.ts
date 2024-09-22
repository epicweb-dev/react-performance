import { getComponentCalls } from '#shared/get-component-calls'
import { testStep, expect, dtl } from '@epic-web/workshop-utils/test'

const { screen, fireEvent } = dtl

await import('./index.tsx')

await testStep('changing the color should re-render the footer', async () => {
	const greenButton = await screen.findByRole('button', { name: /green/i })

	const componentNames = await getComponentCalls(async () => {
		fireEvent.click(greenButton)
		// give everything a bit to render
		await new Promise((resolve) => setTimeout(resolve, 10))
	})

	expect(
		componentNames,
		'🚨 Both `App` and `Footer` components should re-render when changing the color',
	).toEqual(expect.arrayContaining(['Main', 'Footer']))
})

await testStep(
	'clicking the count button should not re-render the footer',
	async () => {
		const countButton = await screen.findByRole('button', { name: /count/i })

		const componentNames = await getComponentCalls(async () => {
			fireEvent.click(countButton)
			// give everything a bit to render
			await new Promise((resolve) => setTimeout(resolve, 10))
		})

		expect(
			componentNames,
			'🚨 the `Main` component should be the only thing to re-render when clicking the count button',
		).toEqual(['Main'])
	},
)

import { getComponentCalls } from '#shared/get-component-calls'
import { testStep, expect, dtl } from '@epic-web/workshop-utils/test'

const { screen, fireEvent } = dtl

await import('./index.tsx')

await testStep(
	'clicking the button should not re-render the footer',
	async () => {
		const button = await screen.findByRole('button', { name: /count/i })

		const componentNames = await getComponentCalls(async () => {
			fireEvent.click(button)
			await new Promise((resolve) => setTimeout(resolve, 10))
		})

		expect(componentNames, '🚨 the `Footer` component re-rendered').toEqual([
			'App',
		])
	},
)

export {}

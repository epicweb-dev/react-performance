import { testStep, expect, dtl } from '@epic-web/workshop-utils/test'
const { screen, fireEvent, waitFor } = dtl

await import('./index.tsx')

await testStep('Clearing the input happens instantly', async () => {
	const checkbox = await screen.findByRole('checkbox', { name: /caterpillar/i })
	fireEvent.click(checkbox)
	await waitFor(() => expect(checkbox).toBeChecked())
	const start = performance.now()
	fireEvent.click(checkbox)
	await waitFor(() => expect(checkbox).not.toBeChecked())
	const end = performance.now()
	expect(
		end - start,
		'🚨 Unchecking the caterpillar checkbox takes too long probably because React is busy rendering the rest of the page',
	).toBeLessThan(50)
})

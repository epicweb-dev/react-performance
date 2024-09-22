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
		'🚨 Both `App` and `FooterImpl` components should re-render when changing the color. Make certain to follow the instructions on how to memoize the `Footer` component and give it a name so these tests can pass.',
	).toEqual(expect.arrayContaining(['App', 'FooterImpl']))
})

await testStep(
	'clicking the count button in Main should not re-render the footer',
	async () => {
		const mainCountButton = await screen.findByRole('button', {
			name: /the count is/i,
		})

		const componentNames = await getComponentCalls(async () => {
			fireEvent.click(mainCountButton)
			// give everything a bit to render
			await new Promise((resolve) => setTimeout(resolve, 10))
		})

		expect(
			componentNames,
			'🚨 Only the `Main` component should re-render when clicking the count button in Main, not the `Footer`',
		).toEqual(['Main'])
	},
)

await testStep(
	'clicking the app count button should not re-render the footer',
	async () => {
		const appCountButton = await screen.findByRole('button', {
			name: /the app count is/i,
		})

		const componentNames = await getComponentCalls(async () => {
			fireEvent.click(appCountButton)
			// give everything a bit to render
			await new Promise((resolve) => setTimeout(resolve, 10))
		})

		expect(
			componentNames,
			'🚨 Only the `App` component should re-render when clicking the app count button, not the `Footer`',
		).toEqual(['App', 'Main'])
	},
)

await testStep('footer should be memoized', async () => {
	const appCountButton = await screen.findByRole('button', {
		name: /the app count is/i,
	})

	const componentNames = await getComponentCalls(async () => {
		fireEvent.click(appCountButton)
		// give everything a bit to render
		await new Promise((resolve) => setTimeout(resolve, 10))
	})

	expect(
		componentNames,
		'🚨 Only the `App` and `Main` components should re-render when clicking the app count button, not the `Footer`',
	).toEqual(['App', 'Main'])
})

await testStep('footer should re-render when name changes', async () => {
	const nameInput = await screen.findByLabelText(/name/i)

	const componentNames = await getComponentCalls(async () => {
		fireEvent.change(nameInput, { target: { value: 'New Name' } })
		// give everything a bit to render
		await new Promise((resolve) => setTimeout(resolve, 10))
	})

	expect(
		componentNames,
		'🚨 The `App`, `Main`, and `FooterImpl` components should re-render when changing the name',
	).toEqual(expect.arrayContaining(['App', 'Main', 'FooterImpl']))
})

await testStep('footer should re-render when color changes', async () => {
	const blueButton = await screen.findByRole('button', { name: /blue/i })

	const componentNames = await getComponentCalls(async () => {
		fireEvent.click(blueButton)
		// give everything a bit to render
		await new Promise((resolve) => setTimeout(resolve, 10))
	})

	expect(
		componentNames,
		'🚨 The `App`, `Main`, and `FooterImpl` components should re-render when changing the name',
	).toEqual(expect.arrayContaining(['App', 'Main', 'FooterImpl']))
})

import { test, expect } from '@playwright/test'

test('searchCities should not be called when clicking force rerender', async ({
	page,
}) => {
	await page.route('**/cities/index.ts', async (route) => {
		const response = await route.fetch()
		let content = await response.text()
		content = content.replace(
			'export function searchCities',
			'function searchCities',
		)
		const instrumentedCode = `
// code below is added by the test:
window.__epicshop = { clearSearchCitiesCalls: () => window.__epicshop.searchCitiesCalls = [] }
window.__epicshop.clearSearchCitiesCalls()

function searchCitiesInstrumented(...args) {
	window.__epicshop.searchCitiesCalls.push(args)
	return searchCities(...args)
}

export { searchCitiesInstrumented as searchCities }
		`
		content = `${content}\n\n${instrumentedCode}`

		await route.fulfill({ body: content, headers: response.headers() })
	})
	await page.goto('/')
	await page.waitForLoadState('networkidle')

	await page.evaluate(() => (window as any).__epicshop.clearSearchCitiesCalls())
	await page.getByRole('button', { name: /force/i }).click()
	const searchCitiesCalls: Array<Array<string>> = await page.evaluate(
		() => (window as any).__epicshop.searchCitiesCalls,
	)

	expect(
		searchCitiesCalls,
		'🚨 searchCities was called when clicking force rerender. Because nothing changed in the user input when clicking that button, searchCities should not have been called. Wrap searchCities inside useMemo with the input as a dependency to fix this.',
	).toHaveLength(0)
})

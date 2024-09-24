import { test, expect } from '@playwright/test'

test('should load the globe and countries modules on demand', async ({
	page,
}) => {
	await page.goto('/')
	await page.waitForLoadState('networkidle')

	await page.getByRole('checkbox', { name: /show globe/i }).click()

	await expect(
		page.getByText(/loading/i),
		'🚨 the suspense fallback should show "loading" when showing the globe while the js is lazy loaded',
	).toBeVisible()
	// Wait for the network to be idle after clicking the button
	await page.waitForLoadState('networkidle')

	const jsRequests = await page.evaluate(() =>
		performance
			.getEntriesByType('resource')
			.filter((entry) => entry.initiatorType === 'script')
			.map((entry) => entry.name),
	)

	// Check if any of the requests include 'globe' or 'countries' in their name
	const hasGlobeOrCountriesModule = jsRequests.some(
		(url) => url.includes('globe') || url.includes('countries'),
	)

	expect(hasGlobeOrCountriesModule).toBe(
		true,
		'Expected to find a request for globe or countries module',
	)
})

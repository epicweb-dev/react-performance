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

	await page.waitForTimeout(100)
	await page.waitForLoadState('networkidle')

	const jsRequests = await page.evaluate(() =>
		performance
			.getEntriesByType('resource')
			.filter((entry) => entry.initiatorType === 'script')
			.map((entry) => entry.name),
	)

	expect(
		jsRequests,
		'🚨 Expected to find a request for the globe module',
	).toEqual(expect.arrayContaining([expect.stringContaining('globe')]))

	expect(
		jsRequests,
		'🚨 Expected to find a request for the countries module',
	).toEqual(expect.arrayContaining([expect.stringContaining('countries')]))
})

import { test, expect } from '@playwright/test'

test('should not show a pending UI when the globe is ready', async ({
	page,
}) => {
	await page.goto('/')
	await page.waitForLoadState('networkidle')

	await page.getByRole('checkbox', { name: /show globe/i }).focus()
	await page.waitForTimeout(100)
	await page.waitForLoadState('networkidle')

	const jsRequests = await page.evaluate(() =>
		performance
			.getEntriesByType('resource')
			.filter(
				(entry) =>
					(entry as PerformanceResourceTiming).initiatorType === 'script',
			)
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

	await page.getByRole('checkbox', { name: /show globe/i }).click()
	await expect(
		page.getByText(/loading/i),
		'🚨 the suspense fallback should not show when the globe is already loaded',
	).not.toBeVisible()
})

test('should still show a pending UI when the globe is not ready', async ({
	page,
}) => {
	await page.goto('/')
	await page.waitForLoadState('networkidle')

	await page.route('**/*', async (route) => {
		if (route.request().resourceType() === 'script') {
			setTimeout(() => route.continue(), 600) // Simulate a slow load time for scripts
		} else {
			await route.continue()
		}
	})

	await page.getByRole('checkbox', { name: /show globe/i }).click()

	await expect(
		page.locator('[style*="opacity:"]:not([style*="opacity: 1"])'),
		'🚨 the pending UI should show when the globe is not ready and takes a while to load',
	).toBeVisible()
})

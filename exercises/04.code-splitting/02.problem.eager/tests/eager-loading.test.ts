import { test, expect } from '@playwright/test'

test('should load the globe and countries modules on hover', async ({
	page,
}) => {
	await page.goto('/')
	await page.waitForLoadState('networkidle')

	await page.getByRole('checkbox', { name: /show globe/i }).hover()
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
})

test('should load the globe and countries modules on focus', async ({
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
})

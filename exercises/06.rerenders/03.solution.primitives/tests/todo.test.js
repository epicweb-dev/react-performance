import { test, expect } from '@playwright/test'

test('todo', async ({ page }) => {
	await page.goto('/')
	await page.waitForLoadState('networkidle')
	// TODO: finish this test
})

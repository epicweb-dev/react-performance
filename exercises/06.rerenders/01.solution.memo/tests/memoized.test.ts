import { test, expect } from '@playwright/test'

test('Only ListItem should not rerender when clicking force rerender', async ({
	page,
}) => {
	await page.route('/', async (route) => {
		const request = route.request()
		if (request.resourceType() !== 'document') return route.continue()
		const response = await route.fetch()

		let html = await response.text()
		const scriptToInject = `
			<script>
				let internals

				function enhanceExistingHook(existingHook) {
					const originalInject = existingHook.inject

					existingHook.inject = (injectedInternals) => {
						internals = injectedInternals

						// Returning a number as React expects a renderer ID
						return originalInject?.call(existingHook, injectedInternals) ?? 1
					}

					return existingHook
				}

				function createMinimalHook() {
					return {
						renderers: [],
						supportsFiber: true,
						inject: (injectedInternals) => {
							internals = injectedInternals
							return 1 // Returning a number as React expects a renderer ID
						},
						onCommitFiberRoot: () => {},
						onCommitFiberUnmount: () => {},
					}
				}

				async function getComponentCalls(cb) {
					const componentNames = []
					if (!internals) {
						throw new Error('🚨 React DevTools is not available')
					}

					internals.enableProfilerTimer = true
					internals.enableProfilerCommitHooks = true
					internals.injectProfilingHooks({
						markComponentRenderStarted: (fiber) => {
							componentNames.push(fiber.type.name || 'Anonymous')
						},
					})

					await cb()

					internals.enableProfilerTimer = false
					internals.enableProfilerCommitHooks = false
					internals.injectProfilingHooks(null)

					return componentNames
				}

				window.getComponentCalls = getComponentCalls

				if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
					window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = enhanceExistingHook(
						window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
					)
				} else {
					window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = createMinimalHook()
				}
			</script>
		`
		html = html.replace('<head>', `<head>${scriptToInject}`)
		route.fulfill({ body: html, headers: { 'content-type': 'text/html' } })
	})

	await page.goto('/')
	await page.waitForLoadState('networkidle')

	const calledComponents: Array<string> = await page.evaluate(() =>
		(window as any).getComponentCalls(() => {
			document.querySelector('button')?.click()
		}),
	)

	expect(
		calledComponents,
		'🚨 The ListItem component was rendered when clicking force render. Use the `memo` utility from React on the ListItem component to prevent this.',
	).not.toContain('ListItem')
})

declare global {
	interface Window {
		__REACT_DEVTOOLS_GLOBAL_HOOK__?: any
	}
}

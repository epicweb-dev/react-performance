import { test, expect } from '@playwright/test'

test('Only two ListItems should not rerender when the highlighted item changes', async ({
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

	// get the first item highlighted
	await page.evaluate(() => {
		const input = document.querySelector('input')
		if (!input) {
			throw new Error('🚨 could not find the input')
		}
		input.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'ArrowDown',
				keyCode: 40,
				bubbles: true,
			}),
		)
	})

	// go to the next item, we should now have two that render, the old one to unhighlight it and the new one to highlight it
	const calledComponents: Array<string> = await page.evaluate(() =>
		(window as any).getComponentCalls(() => {
			const input = document.querySelector('input')
			if (!input) {
				throw new Error('🚨 could not find the input')
			}
			input.dispatchEvent(
				new KeyboardEvent('keydown', {
					key: 'ArrowDown',
					keyCode: 40,
					bubbles: true,
				}),
			)
		}),
	)

	// memo can change the name of the components, so we'll be more generous with a regex
	const listItemRenders = calledComponents.filter((c) => /ListItem/i.test(c))

	expect(
		listItemRenders,
		'🚨 Only two ListItems should render when changing the highlighted item. The first is rerendered to un-highlight it and the second is rerendered to highlight it. Make sure your comparator is correct.',
	).toHaveLength(2)
})

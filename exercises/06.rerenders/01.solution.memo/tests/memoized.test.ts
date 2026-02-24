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
				const PerformedWorkFlag = 0b000000000000000000000000001
				const UserCodeFiberTags = new Set([0, 1, 9, 11, 15])

				let activeFallbackComponentNames = null

				function isUserCodeFiberTag(tag) {
					return UserCodeFiberTags.has(tag)
				}

				function getDisplayNameFromType(type) {
					if (!type) return null

					if (typeof type === 'function') {
						return type.displayName || type.name || null
					}

					if (typeof type === 'object') {
						if (typeof type.displayName === 'string' && type.displayName) {
							return type.displayName
						}

						if (typeof type.render === 'function') {
							return type.render.displayName || type.render.name || null
						}

						if (type.type) {
							return getDisplayNameFromType(type.type)
						}
					}

					return null
				}

				function getFiberDisplayName(fiber) {
					return getDisplayNameFromType(fiber.type) || getDisplayNameFromType(fiber.elementType)
				}

				function didFiberRender(previousFiber, nextFiber) {
					if (!previousFiber) return true
					return (nextFiber.flags & PerformedWorkFlag) === PerformedWorkFlag
				}

				function collectRenderedComponentsFromCommit(root) {
					if (!activeFallbackComponentNames || !root?.current) return

					const stack = [root.current]
					while (stack.length > 0) {
						const fiber = stack.pop()
						if (!fiber) continue

						if (fiber.sibling) stack.push(fiber.sibling)
						if (fiber.child) stack.push(fiber.child)

						if (!isUserCodeFiberTag(fiber.tag)) continue
						if (!didFiberRender(fiber.alternate, fiber)) continue

						const componentName = getFiberDisplayName(fiber) ?? 'Anonymous'
						activeFallbackComponentNames.push(componentName)
					}
				}

				function enhanceExistingHook(existingHook) {
					const originalInject = existingHook.inject
					const originalCommitFiberRoot = existingHook.onCommitFiberRoot

					existingHook.inject = (injectedInternals) => {
						internals = injectedInternals

						// Returning a number as React expects a renderer ID
						return originalInject?.call(existingHook, injectedInternals) ?? 1
					}

					existingHook.onCommitFiberRoot = (...args) => {
						const [, root] = args
						collectRenderedComponentsFromCommit(root)
						return originalCommitFiberRoot?.apply(existingHook, args)
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
						onCommitFiberRoot: (_rendererId, root) => {
							collectRenderedComponentsFromCommit(root)
						},
						onCommitFiberUnmount: () => {},
					}
				}

				async function getComponentCalls(cb) {
					const componentNames = []
					if (!internals) {
						throw new Error('🚨 React DevTools is not available')
					}

					const supportsInjectedProfilingHooks =
						typeof internals.injectProfilingHooks === 'function'

					if (supportsInjectedProfilingHooks) {
						internals.enableProfilerTimer = true
						internals.enableProfilerCommitHooks = true
						internals.injectProfilingHooks({
							markComponentRenderStarted: (fiber) => {
								componentNames.push(fiber.type.name || 'Anonymous')
							},
						})
					} else {
						activeFallbackComponentNames = componentNames
					}

					try {
						await cb()
					} finally {
						if (supportsInjectedProfilingHooks) {
							internals.enableProfilerTimer = false
							internals.enableProfilerCommitHooks = false
							internals.injectProfilingHooks(null)
						} else {
							activeFallbackComponentNames = null
						}
					}

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
		await route.fulfill({
			body: html,
			headers: { 'content-type': 'text/html' },
		})
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

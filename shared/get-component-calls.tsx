declare global {
	interface Window {
		__REACT_DEVTOOLS_GLOBAL_HOOK__?: any
	}
}

let internals: any

function enhanceExistingHook(existingHook: any) {
	const originalInject = existingHook.inject

	existingHook.inject = (injectedInternals: any) => {
		internals = injectedInternals

		// Returning a number as React expects a renderer ID
		return originalInject?.call(existingHook, injectedInternals) ?? 1
	}

	return existingHook
}

function createMinimalHook() {
	return {
		supportsFiber: true,
		inject: (injectedInternals: any) => {
			internals = injectedInternals
			return 1 // Returning a number as React expects a renderer ID
		},
		onCommitFiberRoot: () => {},
		onCommitFiberUnmount: () => {},
	}
}

export async function getComponentCalls(cb: () => void | Promise<void>) {
	const componentNames: Array<string> = []
	if (!internals) {
		throw new Error('🚨 React DevTools is not available')
	}

	internals.enableProfilerTimer = true
	internals.enableProfilerCommitHooks = true
	internals.injectProfilingHooks({
		markComponentRenderStarted: (fiber: any) => {
			componentNames.push(fiber.type.name || 'Anonymous')
		},
	})

	await cb()

	internals.enableProfilerTimer = false
	internals.enableProfilerCommitHooks = false
	internals.injectProfilingHooks(null)

	return componentNames
}

if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
	window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = enhanceExistingHook(
		window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
	)
} else {
	window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = createMinimalHook()
}

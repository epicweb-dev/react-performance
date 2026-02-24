declare global {
	interface Window {
		__REACT_DEVTOOLS_GLOBAL_HOOK__?: any
	}
}

let internals: any

const PerformedWorkFlag = 0b000000000000000000000000001
const FunctionComponentTag = 0
const ClassComponentTag = 1
const ContextConsumerTag = 9
const ForwardRefTag = 11
const SimpleMemoComponentTag = 15

let activeFallbackComponentNames: Array<string> | null = null

function isUserCodeFiberTag(tag: number) {
	return (
		tag === FunctionComponentTag ||
		tag === ClassComponentTag ||
		tag === ContextConsumerTag ||
		tag === ForwardRefTag ||
		tag === SimpleMemoComponentTag
	)
}

function getDisplayNameFromType(type: any): string | null {
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

function getFiberDisplayName(fiber: any) {
	return getDisplayNameFromType(fiber.type) || getDisplayNameFromType(fiber.elementType)
}

function didFiberRender(previousFiber: any, nextFiber: any) {
	if (!previousFiber) return true
	return (nextFiber.flags & PerformedWorkFlag) === PerformedWorkFlag
}

function collectRenderedComponentsFromCommit(root: any) {
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

function enhanceExistingHook(existingHook: any) {
	const originalInject = existingHook.inject
	const originalCommitFiberRoot = existingHook.onCommitFiberRoot

	existingHook.inject = (injectedInternals: any) => {
		internals = injectedInternals

		// Returning a number as React expects a renderer ID
		return originalInject?.call(existingHook, injectedInternals) ?? 1
	}

	existingHook.onCommitFiberRoot = (...args: Array<any>) => {
		const [, root] = args
		collectRenderedComponentsFromCommit(root)
		return originalCommitFiberRoot?.apply(existingHook, args)
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
		onCommitFiberRoot: (_rendererId: number, root: any) => {
			collectRenderedComponentsFromCommit(root)
		},
		onCommitFiberUnmount: () => {},
	}
}

export async function getComponentCalls(cb: () => void | Promise<void>) {
	const componentNames: Array<string> = []
	if (!internals) {
		throw new Error('🚨 React DevTools is not available')
	}

	const supportsInjectedProfilingHooks =
		typeof internals.injectProfilingHooks === 'function'

	if (supportsInjectedProfilingHooks) {
		internals.enableProfilerTimer = true
		internals.enableProfilerCommitHooks = true
		internals.injectProfilingHooks({
			markComponentRenderStarted: (fiber: any) => {
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

if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
	window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = enhanceExistingHook(
		window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
	)
} else {
	window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = createMinimalHook()
}

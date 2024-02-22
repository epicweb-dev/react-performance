type Deferred<ResolveType = any> = {
	promise: Promise<ResolveType>
	resolve: (resolution: ResolveType) => void
	reject: (rejection: any) => void
}

function makeDeferred<ResolveType>() {
	const deferred = {} as Deferred<ResolveType>
	deferred.promise = new Promise((res, rej) => {
		deferred.resolve = res
		deferred.reject = rej
	})
	return deferred
}

export function makeWorkerApi(worker: Worker) {
	const messageMap = new Map<string, Deferred>()
	worker.onmessage = event => {
		if (!event.data) return
		const { messageId, result } = event.data
		const deferred = messageMap.get(messageId)
		if (!deferred) return
		deferred.resolve(result)
	}
	worker.onerror = error => {
		console.error('there was an error in the web worker', error)
	}

	return async function sendWorkerMessage({
		type,
		args,
	}: {
		type: string
		args: Array<unknown>
	}) {
		const messageId = Math.random().toString(16).slice(2)
		const deferred = makeDeferred()
		messageMap.set(messageId, deferred)
		worker.postMessage({ messageId, type, args })
		return deferred.promise
	}
}

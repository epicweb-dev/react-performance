import { useCombobox as useDownshiftCombobox } from 'downshift'
import { useCallback, useReducer } from 'react'

export const useForceRerender = () => useReducer(x => x + 1, 0)[1]

type AsyncState<DataType> =
	| {
			status: 'idle'
			data?: null
			error?: null
			promise?: null
	  }
	| {
			status: 'pending'
			data?: null
			error?: null
			promise: Promise<DataType>
	  }
	| {
			status: 'resolved'
			data: DataType
			error: null
			promise: null
	  }
	| {
			status: 'rejected'
			data: null
			error: Error
			promise: null
	  }

type AsyncAction<DataType> =
	| { type: 'reset' }
	| { type: 'pending'; promise: Promise<DataType> }
	| { type: 'resolved'; data: DataType; promise?: Promise<DataType> }
	| { type: 'rejected'; error: Error; promise?: Promise<DataType> }

function asyncReducer<DataType>(
	state: AsyncState<DataType>,
	action: AsyncAction<DataType>,
): AsyncState<DataType> {
	switch (action.type) {
		case 'pending': {
			return {
				status: 'pending',
				data: null,
				error: null,
				promise: action.promise,
			}
		}
		case 'resolved': {
			if (action.promise && action.promise !== state.promise) return state
			return {
				status: 'resolved',
				data: action.data,
				error: null,
				promise: null,
			}
		}
		case 'rejected': {
			if (action.promise && action.promise !== state.promise) return state
			return {
				status: 'rejected',
				data: null,
				error: action.error,
				promise: null,
			}
		}
		default: {
			throw new Error(`Unhandled action type: ${action.type}`)
		}
	}
}

export function useAsync<DataType>() {
	const [state, dispatch] = useReducer<
		React.Reducer<AsyncState<DataType>, AsyncAction<DataType>>
	>(asyncReducer, {
		status: 'idle',
		data: null,
		error: null,
	})

	const { data, error, status } = state

	const run = useCallback((promise: Promise<DataType>) => {
		dispatch({ type: 'pending', promise })
		promise.then(
			data => {
				dispatch({ type: 'resolved', data, promise })
			},
			error => {
				dispatch({ type: 'rejected', error, promise })
			},
		)
	}, [])

	const setData = useCallback(
		(data: DataType) => dispatch({ type: 'resolved', data }),
		[dispatch],
	)
	const setError = useCallback(
		(error: Error) => dispatch({ type: 'rejected', error }),
		[dispatch],
	)

	return {
		setData,
		setError,
		error,
		status,
		data,
		run,
	}
}

export function useCombobox<Item>(
	options: Parameters<typeof useDownshiftCombobox<Item>>[0],
) {
	const { itemToString = item => item || '' } = options
	return useDownshiftCombobox({
		stateReducer(state, { type, changes }) {
			// downshift's default is to select the highlighted item on blur
			// but we don't like that so we're using the state reducer to change
			// that default behavior
			// https://github.com/downshift-js/downshift/issues/1040
			if (type === useDownshiftCombobox.stateChangeTypes.InputBlur) {
				return {
					...changes,
					highlightedIndex: -1,
					selectedItem: state.selectedItem,
					inputValue: String(itemToString(state.selectedItem)) || '',
				}
			}
			// changing the selection programmatically should also reset the
			// input value by default
			// https://github.com/downshift-js/downshift/issues/1049
			if (type === useDownshiftCombobox.stateChangeTypes.FunctionSelectItem) {
				return {
					...changes,
					inputValue: '',
				}
			}
			return changes
		},
		...options,
	})
}

import * as React from 'react'
import useInterval from 'use-interval'

type IUseAsyncState<T> = {
  data: T | null
  status: 'idle' | 'pending' | 'resolved' | 'rejected'
  error: unknown | null
}

type IUseAsyncAction<T> =
  | {
      status: 'pending'
    }
  | {
      status: 'resolved'
      data: T
    }
  | {
      status: 'rejected'
      error: unknown
    }
  | {
      data: T
    }
  | {
      error: unknown
    }

type IUseAsyncParams<T> = Pick<IUseAsyncState<T>, 'data' | 'status'>

type IUseAsyncRunFn<T> = (promise: Promise<T>) => Promise<T>

type ICellProps = {
  row: number
  column: number
  cell?: number
}

type IAppGridProps = {
  onUpdateGrid: () => void
  rows: number
  columns: number
  handleRowsChange: (row: string) => void
  handleColumnsChange: (column: string) => void
  Cell: React.FunctionComponent<ICellProps>
}

function useSafeDispatch<T>(dispatch: React.Dispatch<T>) {
  const mounted = React.useRef(false)
  React.useLayoutEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  return React.useCallback<(args: T) => void>(
    args => {
      if (!mounted.current) {
        return
      }

      dispatch(args)
    },
    [dispatch],
  )
}

// Example usage:
// const {data, error, status, run} = useAsync()
// React.useEffect(() => {
//   run(fetchPokemon(pokemonName))
// }, [pokemonName, run])
const defaultInitialState = {status: 'idle', data: null, error: null}

function useAsync<T>(initialState?: IUseAsyncParams<T>) {
  const initialStateRef = React.useRef({
    ...(defaultInitialState as IUseAsyncState<T>),
    ...initialState,
  })
  const [{status, data, error}, setState] = React.useReducer<
    React.Reducer<IUseAsyncState<T>, IUseAsyncAction<T>>
  >((s, a) => ({...s, ...a}), initialStateRef.current)

  const safeSetState = useSafeDispatch(setState)

  const run = React.useCallback<IUseAsyncRunFn<T>>(
    promise => {
      if (!(promise instanceof Promise)) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`,
        )
      }
      safeSetState({status: 'pending'})
      return promise.then(
        data => {
          safeSetState({data, status: 'resolved'})
          return data
        },
        error => {
          safeSetState({status: 'rejected', error})
          return error
        },
      )
    },
    [safeSetState],
  )

  const setData = React.useCallback<(data: T) => void>(
    data => safeSetState({data}),
    [safeSetState],
  )
  const setError = React.useCallback<(error: unknown | null) => void>(
    error => safeSetState({error}),
    [safeSetState],
  )
  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState],
  )

  return {
    // using the same names that react-query uses for convenience
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  }
}

const useForceRerender = () => React.useReducer(x => x + 1, 0)[1]

function debounce<T>(cb: React.Dispatch<T>, time: number) {
  let timeout: number
  return (...args: T[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(cb, time, ...args)
  }
}

// this only needs to exist because concurrent mode isn't here yet. When we get
// that then so much of our hack-perf fixes go away!
function useDebouncedState<T>(
  initialState: T,
): [T, (...args: React.SetStateAction<T>[]) => void] {
  const [state, setState] = React.useState(initialState)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetState = React.useCallback(debounce(setState, 200), [])
  return [state, debouncedSetState]
}

function Interval({
  onInterval,
  interval,
}: {
  onInterval: () => void
  interval: number | false | null
}) {
  useInterval(onInterval, interval)
  return null
}

const AppGrid = ({
  onUpdateGrid,
  rows,
  handleRowsChange,
  columns,
  handleColumnsChange,
  Cell,
}: IAppGridProps) => {
  const [keepUpdated, setKeepUpdated] = React.useState(false)
  return (
    <div>
      <form onSubmit={e => e.preventDefault()}>
        <div>
          <button type="button" onClick={onUpdateGrid}>
            Update Grid Data
          </button>
        </div>
        <div>
          <label htmlFor="keepUpdated">Keep Grid Data updated</label>
          <input
            id="keepUpdated"
            checked={keepUpdated}
            type="checkbox"
            onChange={e => setKeepUpdated(e.target.checked)}
          />
          {keepUpdated ? (
            <Interval onInterval={onUpdateGrid} interval={500} />
          ) : null}
        </div>
        <div>
          <label htmlFor="rows">Rows to display: </label>
          <input
            id="rows"
            defaultValue={rows}
            type="number"
            min={1}
            max={100}
            onChange={e => handleRowsChange(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="columns">Columns to display: </label>
          <input
            id="columns"
            defaultValue={columns}
            type="number"
            min={1}
            max={100}
            onChange={e => handleColumnsChange(e.target.value)}
          />
        </div>
      </form>
      <div
        style={{
          width: '100%',
          maxWidth: 410,
          maxHeight: 820,
          overflow: 'scroll',
        }}
      >
        <div style={{width: columns * 40}}>
          {Array.from({length: rows}).map((r, row) => (
            <div key={row} style={{display: 'flex'}}>
              {Array.from({length: columns}).map((c, column) => (
                <Cell key={column} row={row} column={column} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function updateGridState(grid: number[][]) {
  return grid.map(row => {
    return row.map(cell => (Math.random() > 0.7 ? Math.random() * 100 : cell))
  })
}

function updateGridCellState(
  grid: number[][],
  {row, column}: {row: number; column: number},
) {
  return grid.map((cells, rI) => {
    if (rI === row) {
      return cells.map((cell, cI) => {
        if (cI === column) {
          return Math.random() * 100
        }
        return cell
      })
    }
    return cells
  })
}

export {
  useAsync,
  useForceRerender,
  useDebouncedState,
  Interval,
  AppGrid,
  updateGridState,
  updateGridCellState,
}

// Optimize context value
// http://localhost:3000/isolated/final/05.js

import * as React from 'react'
import {
  useForceRerender,
  useDebouncedState,
  AppGrid,
  updateGridState,
  updateGridCellState,
} from '../utils'

type IAppAction =
  | {
      type: 'UPDATE_GRID'
    }
  | {
      type: 'UPDATE_GRID_CELL'
      row: number
      column: number
    }
  | {
      type: 'TYPED_IN_DOG_INPUT'
      dogName: string
    }

type IAppState = {
  grid: number[][]
  dogName: string
}

type ICellProps = {
  row: number
  column: number
}

const AppStateContext = React.createContext<
  [IAppState, React.Dispatch<IAppAction>] | null
>(null)

const initialGrid = Array.from({length: 100}, () =>
  Array.from({length: 100}, () => Math.random() * 100),
)

const appReducer = (state: IAppState, action: IAppAction) => {
  switch (action.type) {
    case 'TYPED_IN_DOG_INPUT': {
      return {...state, dogName: action.dogName}
    }
    case 'UPDATE_GRID_CELL': {
      return {
        ...state,
        grid: updateGridCellState(state.grid, {
          row: action.row,
          column: action.column,
        }),
      }
    }
    case 'UPDATE_GRID': {
      return {...state, grid: updateGridState(state.grid)}
    }
    default: {
      //@ts-expect-error
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const AppProvider = ({children}: {children: React.ReactNode}) => {
  const [state, dispatch] = React.useReducer(appReducer, {
    dogName: '',
    grid: initialGrid,
  })
  const value: [typeof state, React.Dispatch<IAppAction>] = React.useMemo(
    () => [state, dispatch],
    [state],
  )
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

const useAppState = () => {
  const context = React.useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within the AppProvider')
  }
  return context
}

const Grid = React.memo(() => {
  const [, dispatch] = useAppState()
  const [rows, setRows] = useDebouncedState(50)
  const [columns, setColumns] = useDebouncedState(50)
  const updateGridData = () => dispatch({type: 'UPDATE_GRID'})
  return (
    <AppGrid
      onUpdateGrid={updateGridData}
      rows={rows}
      handleRowsChange={setRows}
      columns={columns}
      handleColumnsChange={setColumns}
      Cell={Cell}
    />
  )
})

const Cell = React.memo(({row, column}: ICellProps) => {
  const [state, dispatch] = useAppState()

  // kinda hacky way to fix this issue
  // there's possible a better way to do this...
  const cell = Array.from(state.grid[row] ?? [])[column] ?? 0

  const handleClick = () => dispatch({type: 'UPDATE_GRID_CELL', row, column})
  return (
    <button
      className="cell"
      onClick={handleClick}
      style={{
        color: cell > 50 ? 'white' : 'black',
        backgroundColor: `rgba(0, 0, 0, ${cell / 100})`,
      }}
    >
      {Math.floor(cell)}
    </button>
  )
})

const DogNameInput = () => {
  const [state, dispatch] = useAppState()
  const {dogName} = state

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDogName = event.target.value
    dispatch({type: 'TYPED_IN_DOG_INPUT', dogName: newDogName})
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <label htmlFor="dogName">Dog Name</label>
      <input
        value={dogName}
        onChange={handleChange}
        id="dogName"
        placeholder="Toto"
      />
      {dogName ? (
        <div>
          <strong>{dogName}</strong>, I've a feeling we're not in Kansas anymore
        </div>
      ) : null}
    </form>
  )
}

const App = () => {
  const forceRerender = useForceRerender()
  return (
    <div className="grid-app">
      <button onClick={forceRerender}>force rerender</button>
      <AppProvider>
        <div>
          <DogNameInput />
          <Grid />
        </div>
      </AppProvider>
    </div>
  )
}

export default App

/*
eslint
  no-func-assign: 0,
*/

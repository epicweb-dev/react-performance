// Optimize context value
// http://localhost:3000/isolated/final/05.js

import React from 'react'
import useInterval from 'use-interval'
import {useForceRerender, useDebouncedState} from '../utils'

const AppStateContext = React.createContext()

// increase this number to make the speed difference more stark.
const dimensions = 100
const initialGrid = Array.from({length: dimensions}, () =>
  Array.from({length: dimensions}, () => Math.random() * 100),
)

const initialRowsColumns = Math.floor(dimensions / 2)

function appReducer(state, action) {
  switch (action.type) {
    case 'TYPED_IN_DOG_INPUT': {
      return {...state, dogName: action.dogName}
    }
    case 'UPDATE_GRID_CELL': {
      const {row, column} = action
      return {
        ...state,
        grid: state.grid.map((cells, rI) => {
          if (rI === row) {
            return cells.map((cell, cI) => {
              if (cI === column) {
                return Math.random() * 100
              }
              return cell
            })
          }
          return cells
        }),
      }
    }
    case 'UPDATE_GRID': {
      return {
        ...state,
        grid: state.grid.map(row => {
          return row.map(cell =>
            Math.random() > 0.7 ? Math.random() * 100 : cell,
          )
        }),
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function AppProvider({children}) {
  const [state, dispatch] = React.useReducer(appReducer, {
    dogName: '',
    grid: initialGrid,
  })
  const value = React.useMemo(() => [state, dispatch], [state])
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

function useAppState() {
  const context = React.useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within the AppProvider')
  }
  return context
}

function UpdateGridOnInterval() {
  const [, dispatch] = useAppState()
  useInterval(() => dispatch({type: 'UPDATE_GRID'}), 500)
  return null
}
UpdateGridOnInterval = React.memo(UpdateGridOnInterval)

function ChangingGrid() {
  const [keepUpdated, setKeepUpdated] = React.useState(false)
  const [, dispatch] = useAppState()
  const [rows, setRows] = useDebouncedState(initialRowsColumns)
  const [columns, setColumns] = useDebouncedState(initialRowsColumns)
  return (
    <div>
      <form onSubmit={e => e.preventDefault()}>
        <div>
          <button type="button" onClick={() => dispatch({type: 'UPDATE_GRID'})}>
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
          {keepUpdated ? <UpdateGridOnInterval /> : null}
        </div>
        <div>
          <label htmlFor="rows">Rows to display: </label>
          <input
            id="rows"
            defaultValue={rows}
            type="number"
            min={1}
            max={dimensions}
            onChange={e => setRows(e.target.value)}
          />
          {` (max: ${dimensions})`}
        </div>
        <div>
          <label htmlFor="columns">Columns to display: </label>
          <input
            id="columns"
            defaultValue={columns}
            type="number"
            min={1}
            max={dimensions}
            onChange={e => setColumns(e.target.value)}
          />
          {` (max: ${dimensions})`}
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
ChangingGrid = React.memo(ChangingGrid)

function Cell({row, column}) {
  const [state, dispatch] = useAppState()
  const cell = state.grid[row][column]
  const handleClick = () => dispatch({type: 'UPDATE_GRID_CELL', row, column})
  return (
    <button
      onClick={handleClick}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        color: cell > 50 ? 'white' : 'black',
        backgroundColor: `rgba(0, 0, 0, ${cell / 100})`,
        border: '1px solid black',
      }}
    >
      {Math.floor(cell)}
    </button>
  )
}
Cell = React.memo(Cell)

function DogNameInput() {
  const [state, dispatch] = useAppState()
  const {dogName} = state

  function handleChange(event) {
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

function App() {
  const forceRerender = useForceRerender()
  return (
    <div className="grid-app">
      <button onClick={forceRerender}>force rerender</button>
      <AppProvider>
        <div>
          <DogNameInput />
          <ChangingGrid />
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

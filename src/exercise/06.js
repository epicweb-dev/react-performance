// Optimize context value
// http://localhost:3000/isolated/exercise/06.js

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
    case 'UPDATE_GRID_CELL': {
      const {rowIndex, columnIndex} = action
      return {
        ...state,
        grid: state.grid.map((row, rI) => {
          if (rI === rowIndex) {
            return row.map((cell, cI) => {
              if (cI === columnIndex) {
                return Math.random() * 100
              }
              return cell
            })
          }
          return row
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

function AppStateProvider({children}) {
  const [state, dispatch] = React.useReducer(appReducer, {
    grid: initialGrid,
  })
  // 🐨 memoize this value with React.useMemo
  const value = [state, dispatch]
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

function useAppState() {
  const context = React.useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within the AppStateProvider')
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
  const [state, dispatch] = useAppState()
  const [rows, setRows] = useDebouncedState(initialRowsColumns)
  const [columns, setColumns] = useDebouncedState(initialRowsColumns)
  const cellWidth = 40
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
        <div style={{width: columns * cellWidth}}>
          {state.grid.slice(0, rows).map((row, rI) => (
            <div key={rI} style={{display: 'flex'}}>
              {row.slice(0, columns).map((cell, cI) => (
                <Cell
                  key={cI}
                  cellWidth={cellWidth}
                  cell={cell}
                  rowIndex={rI}
                  columnIndex={cI}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
ChangingGrid = React.memo(ChangingGrid)

function Cell({cellWidth, cell, rowIndex, columnIndex}) {
  const [, dispatch] = useAppState()
  const handleClick = () =>
    dispatch({type: 'UPDATE_GRID_CELL', rowIndex, columnIndex})
  return (
    <div
      onClick={handleClick}
      style={{
        outline: `1px solid black`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        width: cellWidth,
        height: cellWidth,
        color: cell > 50 ? 'white' : 'black',
        backgroundColor: `rgba(0, 0, 0, ${cell / 100})`,
      }}
    >
      {Math.floor(cell)}
    </div>
  )
}
Cell = React.memo(Cell)

function DogNameInput() {
  const [dogName, setDogName] = React.useState('')

  function handleChange(event) {
    const newDogName = event.target.value
    setDogName(newDogName)
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
  return (
    <AppStateProvider>
      <div>
        <DogNameInput />
        <ChangingGrid />
      </div>
    </AppStateProvider>
  )
}

function Usage() {
  const forceRerender = useForceRerender()
  return (
    <div>
      <button onClick={forceRerender}>force rerender</button>
      <App />
    </div>
  )
}

export default Usage

/*
eslint
  no-func-assign: 0,
*/

// Fix "perf death by a thousand cuts"
// 💯 write an HOC to get a slice of app state

// http://localhost:3000/isolated/final/05-extra.3

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
    dogName: '',
    grid: initialGrid,
  })
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

function withStateSlice(Comp, slice) {
  const MemoComp = React.memo(Comp)
  const Wrapper = props => {
    const [state, dispatch] = useAppState()
    return <MemoComp state={slice(state)} dispatch={dispatch} {...props} />
  }
  Wrapper.displayName = `withStateSlice(${Comp.displayName || Comp.name})`
  return Wrapper
}

const ChangingGrid = withStateSlice(
  function ChangingGrid({state: grid, dispatch}) {
    const [keepUpdated, setKeepUpdated] = React.useState(false)
    const [rows, setRows] = useDebouncedState(initialRowsColumns)
    const [columns, setColumns] = useDebouncedState(initialRowsColumns)
    const cellWidth = 40
    return (
      <div>
        <form onSubmit={e => e.preventDefault()}>
          <div>
            <button
              type="button"
              onClick={() => dispatch({type: 'UPDATE_GRID'})}
            >
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
            {grid.slice(0, rows).map((row, i) => (
              <div key={i} style={{display: 'flex'}}>
                {row.slice(0, columns).map((cell, cI) => (
                  <Cell key={cI} cellWidth={cellWidth} cell={cell} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  state => state.grid,
)

function Cell({cellWidth, cell}) {
  return (
    <div
      style={{
        outline: `1px solid black`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
// NOTE: This React.memo on the DogNameInput doesn't really do much,
// but that's kinda the point. Once people start saying they need React.memo
// all over the place, they start doing it everywhere whether it's actually
// needed or not
DogNameInput = React.memo(DogNameInput)

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

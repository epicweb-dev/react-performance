// Fix "perf death by a thousand cuts"
// 💯 use recoil
// http://localhost:3000/isolated/final/06.extra-4.js

import React from 'react'
import useInterval from 'use-interval'
import {useForceRerender, useDebouncedState} from '../utils'
import {RecoilRoot, useRecoilState, useRecoilCallback, atomFamily} from 'recoil'

const AppStateContext = React.createContext()

// increase this number to make the speed difference more stark.
const dimensions = 100
const initialGrid = Array.from({length: dimensions}, () =>
  Array.from({length: dimensions}, () => Math.random() * 100),
)

const cellAtoms = atomFamily({
  key: 'cells',
  default: ({row, column}) => initialGrid[row][column],
})

const initialRowsColumns = Math.floor(dimensions / 2)

function appReducer(state, action) {
  switch (action.type) {
    case 'TYPED_IN_DOG_INPUT': {
      return {...state, dogName: action.dogName}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function AppProvider({children}) {
  const [state, dispatch] = React.useReducer(appReducer, {
    dogName: '',
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
    throw new Error('useAppState must be used within the AppProvider')
  }
  return context
}

function useUpdateGrid() {
  return useRecoilCallback(({set}, {rows, columns}) => {
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        if (Math.random() > 0.7) {
          set(cellAtoms({row, column}), Math.random() * 100)
        }
      }
    }
  })
}

function UpdateGridOnInterval({rows, columns}) {
  const updateGrid = useUpdateGrid()
  useInterval(() => updateGrid({rows, columns}), 500)
  return null
}
UpdateGridOnInterval = React.memo(UpdateGridOnInterval)

function ChangingGrid() {
  const [keepUpdated, setKeepUpdated] = React.useState(false)
  const [rows, setRows] = useDebouncedState(initialRowsColumns)
  const [columns, setColumns] = useDebouncedState(initialRowsColumns)
  const updateGrid = useUpdateGrid()
  return (
    <div>
      <form onSubmit={e => e.preventDefault()}>
        <div>
          <button type="button" onClick={() => updateGrid({rows, columns})}>
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
            <UpdateGridOnInterval rows={rows} columns={columns} />
          ) : null}
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
          {Array.from({length: rows}).map((row, rowI) => (
            <div key={rowI} style={{display: 'flex'}}>
              {Array.from({length: columns}).map((cell, cI) => (
                <Cell key={cI} row={rowI} column={cI} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Cell({row, column}) {
  const [cell, setCell] = useRecoilState(cellAtoms({row, column}))
  return (
    <div
      onClick={() => setCell(Math.random() * 100)}
      tabIndex="0"
      style={{
        outline: `1px solid black`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        color: cell > 50 ? 'white' : 'black',
        backgroundColor: `rgba(0, 0, 0, ${cell / 100})`,
      }}
    >
      {Math.floor(cell)}
    </div>
  )
}

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
  return (
    <RecoilRoot>
      <AppProvider>
        <div>
          <DogNameInput />
          <ChangingGrid />
        </div>
      </AppProvider>
    </RecoilRoot>
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

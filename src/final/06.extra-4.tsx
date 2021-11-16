// Fix "perf death by a thousand cuts"
// 💯 use recoil (final)
// http://localhost:3000/isolated/final/06.extra-4.js

import * as React from 'react'
import {useForceRerender, useDebouncedState, AppGrid} from '../utils'
import {RecoilRoot, useRecoilState, useRecoilCallback, atomFamily} from 'recoil'

type IAppAction = {
  type: 'TYPED_IN_DOG_INPUT'
  dogName: string
}

type IAppState = {
  dogName: string
}
type ICellProps = {
  row: number
  column: number
  cell?: number
}

const AppStateContext = React.createContext<
  [IAppState, React.Dispatch<IAppAction>] | null
>(null)

const initialGrid = Array.from({length: 100}, () =>
  Array.from({length: 100}, () => Math.random() * 100),
)

const cellAtoms = atomFamily<number, Pick<ICellProps, 'row' | 'column'>>({
  key: 'cells',

  // kinda hacky way to fix this issue
  // there's possible a better way to do this...
  default: ({row, column}) => Array.from(initialGrid[row] ?? [])[column] ?? 0,
})

function useUpdateGrid() {
  return useRecoilCallback(({set}) => ({rows, columns}) => {
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        if (Math.random() > 0.7) {
          set(cellAtoms({row, column}), Math.random() * 100)
        }
      }
    }
  })
}

function appReducer(state: IAppState, action: IAppAction) {
  switch (action.type) {
    case 'TYPED_IN_DOG_INPUT': {
      return {...state, dogName: action.dogName}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const AppProvider: React.FunctionComponent = ({children}) => {
  const [state, dispatch] = React.useReducer(appReducer, {
    dogName: '',
  })
  const value: [IAppState, React.Dispatch<IAppAction>] = [state, dispatch]
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

function Grid() {
  const updateGrid = useUpdateGrid()
  const [rows, setRows] = useDebouncedState(50)
  const [columns, setColumns] = useDebouncedState(50)
  const updateGridData = () => updateGrid({rows, columns})
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
}

const Cell: React.FunctionComponent<ICellProps> = ({row, column}) => {
  const [cell, setCell] = useRecoilState(cellAtoms({row, column}))
  const handleClick = () => setCell(Math.random() * 100)
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
}

function DogNameInput() {
  const [state, dispatch] = useAppState()
  const {dogName} = state

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
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
      <RecoilRoot>
        <AppProvider>
          <div>
            <DogNameInput />
            <Grid />
          </div>
        </AppProvider>
      </RecoilRoot>
    </div>
  )
}

export default App

/*
eslint
  no-func-assign: 0,
*/

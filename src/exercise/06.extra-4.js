// Starting point for the Recoil Extra Credit
// 💯 use recoil (exercise)
// http://localhost:3000/isolated/exercise/06.extra-4.js

import React from 'react'
import {
  useForceRerender,
  useDebouncedState,
  AppGrid,
  updateGridState,
  updateGridCellState,
} from '../utils'
// 🐨 you're gonna need these:
// import {RecoilRoot, useRecoilState, useRecoilCallback, atomFamily} from 'recoil'

const AppStateContext = React.createContext()

const initialGrid = Array.from({length: 100}, () =>
  Array.from({length: 100}, () => Math.random() * 100),
)

// 🐨 create an atomFamily called `cellAtoms` here where the
// default callback function accepts an object with the
// `row` and `column` and returns the value from the initialGrid
// 💰 initialGrid[row][column]

// 💰 I'm going to give this hook to you as it's mostly here for our contrived
// example purposes. Just comment this in when you're ready to use it.
// Here's how it's used:
// const updateGrid = useUpdateGrid()
// then later: updateGrid({rows, columns})
// function useUpdateGrid() {
//   return useRecoilCallback(({set}, {rows, columns}) => {
//     for (let row = 0; row < rows; row++) {
//       for (let column = 0; column < columns; column++) {
//         if (Math.random() > 0.7) {
//           set(cellAtoms({row, column}), Math.random() * 100)
//         }
//       }
//     }
//   })
// }

function appReducer(state, action) {
  switch (action.type) {
    case 'TYPED_IN_DOG_INPUT': {
      return {...state, dogName: action.dogName}
    }
    // 💣 we're going to use recoil to update the cell values, so delete this case
    case 'UPDATE_GRID_CELL': {
      return {...state, grid: updateGridCellState(state.grid, action)}
    }
    // 💣 the useUpdateGrid hook above will handle this. Delete this case.
    case 'UPDATE_GRID': {
      return {...state, grid: updateGridState(state.grid)}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function AppProvider({children}) {
  const [state, dispatch] = React.useReducer(appReducer, {
    dogName: '',
    // 💣 we're moving our state outside of React with our atom, delete this:
    grid: initialGrid,
  })
  // 🦉 notice that we don't even need to bother memoizing this value
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

function Grid() {
  // 🐨 we're no longer storing the grid in our app state, so instead you
  // want to get the updateGrid function from useUpdateGrid
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
}
// 💣 remove memoization. It's not needed!
Grid = React.memo(Grid)

function Cell({row, column}) {
  // 🐨 replace these three lines with useRecoilState for the cellAtoms
  // 💰 Here's how you calculate the new value for the cell when it's clicked:
  //    Math.random() * 100
  const [state, dispatch] = useAppState()
  const cell = state.grid[row][column]
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
}
// 🦉 notice we don't need to bother memoizing any of the components!!
// 💣 remove memoization
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
      {/* 🐨 wrap this in a RecoilRoot */}
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

import React from 'react'

// Example usage:
// const {data, error} = useAsync(
//   React.useCallback(() => fetchPokemon(pokemonName), [pokemonName]),
// )
// NOTE: the React.useCallback is required because the callback you give to
// useAsync is placed in a dependency array, so you must use React.useCallback
// to ensure that the callback remains consistent until the dependencies change.
function useAsync(cb) {
  const [state, setState] = React.useState({data: undefined, error: undefined})
  React.useEffect(() => {
    let current = true
    cb().then(
      data => {
        if (current) {
          setState({data, error: undefined})
        }
      },
      error => {
        if (current) {
          setState({error, data: undefined})
        }
      },
    )
    return () => {
      current = false
    }
  }, [cb])
  return state
}

const useForceRerender = () => React.useReducer(x => x + 1, 0)[1]

function debounce(cb, time) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(cb, time, ...args)
  }
}

// this only needs to exist because concurrent mode isn't here yet. When we get
// that then so much of our hack-perf fixes go away!
function useDebouncedState(initialState) {
  const [state, setState] = React.useState(initialState)
  const debouncedSetState = React.useCallback(debounce(setState, 200), [])
  return [state, debouncedSetState]
}

export {useAsync, useForceRerender, useDebouncedState}

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

export {useAsync, useForceRerender}

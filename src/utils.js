import React from 'react'

// Example usage:
// const {data, error} = useAsync(
//   React.useCallback(() => fetchPokemon(pokemonName), [pokemonName]),
// )
// NOTE: the React.useCallback is required because the callback you give to
// useAsync is placed in a dependency array, so you must use React.useCallback
// to ensure that the callback remains consistent until the dependencies change.
function useAsync(cb) {
  const [state, setState] = React.useState({data: null, error: null})
  React.useEffect(() => {
    let current = true
    cb().then(
      data => {
        if (current) {
          setState({data, error: null})
        }
      },
      error => {
        if (current) {
          setState({error, data: null})
        }
      },
    )
    return () => {
      current = false
    }
  }, [cb])
  return state
}

export {useAsync}

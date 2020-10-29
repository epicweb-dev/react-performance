// http://localhost:3000/isolated/examples/code-splitting/main.js

import * as React from 'react'

const DepsIncluded = React.lazy(() =>
  import(/* webpackChunkName: "deps" */ './deps-included'),
)
const One = React.lazy(() =>
  import(/* webpackChunkName: "group" */ './group/one'),
)
const Two = React.lazy(() =>
  import(/* webpackChunkName: "group" */ './group/two'),
)

const Prefetched = React.lazy(() =>
  import(
    /* webpackPrefetch: true */
    /* webpackChunkName: "prefetched" */
    './prefetched'
  ),
)
const Preloaded = React.lazy(() =>
  import(
    /* webpackPreload: true */
    /* webpackChunkName: "preload" */
    './preloaded'
  ),
)

function Main() {
  const [show, setShow] = React.useState(false)
  return (
    <React.Suspense fallback="...">
      <button onClick={() => setShow(true)}>Show</button>
      {show ? (
        <div>
          <DepsIncluded />
          <One />
          <Two />
          <Prefetched />
          <Preloaded />
        </div>
      ) : null}
    </React.Suspense>
  )
}

export default Main

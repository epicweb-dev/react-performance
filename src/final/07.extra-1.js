// Production performance monitoring
// 💯 use the experimental trace API
// http://localhost:3000/isolated/final/07.extra-1.js

import * as React from 'react'
import {unstable_trace as trace} from 'scheduler/tracing'
import reportProfile from '../report-profile'

function Counter() {
  const [count, setCount] = React.useState(0)
  const increment = () =>
    trace('click', performance.now(), () => setCount(c => c + 1))
  return <button onClick={increment}>{count}</button>
}

function App() {
  return (
    <div>
      <React.Profiler id="counter" onRender={reportProfile}>
        <div>
          Profiled counter
          <Counter />
        </div>
      </React.Profiler>
      <div>
        Unprofiled counter
        <Counter />
      </div>
    </div>
  )
}

export default App

// Production performance monitoring
// http://localhost:3000/isolated/final/07.js

import * as React from 'react'
import reportProfile from '../report-profile'

function Counter() {
  const [count, setCount] = React.useState(0)
  const increment = () => setCount(c => c + 1)
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

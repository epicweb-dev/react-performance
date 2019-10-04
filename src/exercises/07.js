// Production performance monitoring

// http://localhost:3000/isolated/exercises/07

import React from 'react'
// 🐨 you're going to need the reportProfile function
// 💰 here, let me help you with that...
// import reportProfile from '../report-profile'

function Counter() {
  const [count, setCount] = React.useState(0)
  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>{count}</button>
}

function App() {
  return (
    <div>
      {/*
      🐨 Wrap this div in a React.Profile component
      give it the ID of "counter" and pass reportProfile
      to the onRender prop.
      */}
      <div>
        Profiled counter
        <Counter />
      </div>
      <div>
        Unprofiled counter
        <Counter />
      </div>
    </div>
  )
}

/*
🦉 Elaboration & Feedback
After the instruction, copy the URL below into your browser and fill out the form:
http://ws.kcd.im/?ws=React%20Performance&e=perf%20monitoring&em=
*/

////////////////////////////////////////////////////////////////////
//                                                                //
//                 Don't make changes below here.                 //
// But do look at it to see how your code is intended to be used. //
//                                                                //
////////////////////////////////////////////////////////////////////

function Usage() {
  return <App />
}

export default Usage

// Code splitting

// http://localhost:3000/isolated/exercises/01

import React from 'react'
// 💣 remove this import
import Tilt from '../tilt'

// 🐨 use React.lazy to create a Tilt component
// which using a dynamic import to get the Tilt
// component from the '../tilt' module.

function App() {
  const [showTilt, setShowTilt] = React.useState(false)
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={showTilt}
          onChange={e => setShowTilt(e.target.checked)}
        />
        {' show tilt'}
      </label>
      {/*
        🐨 wrap the code below in a <React.Suspense /> component
        with a fallback.
      */}
      {showTilt ? <Tilt>This is tilted!</Tilt> : null}
    </div>
  )
}

/*
🦉 Elaboration & Feedback
After the instruction, copy the URL below into your browser and fill out the form:
http://ws.kcd.im/?ws=React%20Performance&e=code%20splitting&em=
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

// Code splitting
// 💯 eager loading

// http://localhost:3000/isolated/exercises-final/01-extra.1

import React from 'react'

const loadTilt = () => import('../tilt')
const Tilt = React.lazy(loadTilt)

function App() {
  const [showTilt, setShowTilt] = React.useState(false)

  React.useEffect(() => {
    loadTilt()
  }, [])

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
      <React.Suspense fallback={<div>loading tilt...</div>}>
        {showTilt ? <Tilt>This is tilted!</Tilt> : null}
      </React.Suspense>
    </div>
  )
}
function Usage() {
  return <App />
}

export default Usage

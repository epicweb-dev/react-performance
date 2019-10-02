// Code splitting

import React from 'react'

const Tilt = React.lazy(() => import('../tilt'))

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
      <React.Suspense fallback={<div>loading tilt...</div>}>
        {showTilt ? <Tilt>This is tilted!</Tilt> : null}
      </React.Suspense>
    </div>
  )
}
function Usage() {
  return <App />
}
Usage.title = 'Code splitting'

export default Usage

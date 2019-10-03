// Code splitting
// 💯 eager loading

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
Usage.title = 'Code splitting'

export default Usage

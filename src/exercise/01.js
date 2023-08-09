// Code splitting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

const Globe = React.lazy(() => import(/* webpackPrefetch: true */ '../globe'))

function App() {
  const [showGlobe, setShowGlobe] = React.useState(false)

  async function handleEagerLoading() {
    import('../globe')
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem',
      }}
    >
      <label
        style={{marginBottom: '1rem'}}
        onMouseOver={handleEagerLoading}
        onFocus={handleEagerLoading}
      >
        <input
          type="checkbox"
          checked={showGlobe}
          onChange={e => setShowGlobe(e.target.checked)}
        />
        {' show globe'}
      </label>
      <div style={{width: 400, height: 400}}>
        <React.Suspense fallback={<>loading...</>}>
          {showGlobe ? <Globe /> : null}
        </React.Suspense>
      </div>
    </div>
  )
}

export default App

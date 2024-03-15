import { Suspense, lazy, useState } from 'react'
import * as ReactDOM from 'react-dom/client'
import './index.css'

// 🧝‍♂️ I just gave this arrow function a name and passed it to lazy
const loadGlobe = () => import('./globe.tsx')
const Globe = lazy(loadGlobe)

function App() {
	const [showGlobe, setShowGlobe] = useState(false)

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
				style={{ marginBottom: '1rem' }}
				// 🐨 add onFocus and onPointerEnter events and set them to loadGlobe
			>
				<input
					type="checkbox"
					checked={showGlobe}
					onChange={e => setShowGlobe(e.target.checked)}
				/>
				{' show globe'}
			</label>
			<div style={{ width: 400, height: 400 }}>
				<Suspense fallback="loading...">
					{showGlobe ? <Globe /> : null}
				</Suspense>
			</div>
		</div>
	)
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)

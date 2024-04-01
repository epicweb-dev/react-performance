import { useState } from 'react'
import * as ReactDOM from 'react-dom/client'
import './index.css'
// 💣 remove this import
import Globe from './globe.tsx'

// 🐨 use lazy to create a Globe component which uses a dynamic import
// to get the Globe component from the './globe' module.

function App() {
	const [showGlobe, setShowGlobe] = useState(false)

	// 🐨 wrap the code below in a <Suspense /> component
	// with a fallback.
	// 💰 try putting it in a few different places and observe how that
	// impacts the user experience.
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
			<label style={{ marginBottom: '1rem' }}>
				<input
					type="checkbox"
					checked={showGlobe}
					onChange={e => setShowGlobe(e.currentTarget.checked)}
				/>
				{' show globe'}
			</label>
			<div style={{ width: 400, height: 400 }}>
				{/* 🐨 stick a Suspense boundary around this with a fallback of "loading..." */}
				{showGlobe ? <Globe /> : null}
			</div>
		</div>
	)
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)

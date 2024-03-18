import { useState } from 'react'
import * as ReactDOM from 'react-dom/client'

function Footer({ color }: { color: string }) {
	return <footer style={{ color }}>I am the ({color}) footer</footer>
}

// 🐨 make the Main component accept a footer prop instead of the color prop
// 🦺 the type should be a React.ReactNode
function Main({ color }: { color: string }) {
	const [count, setCount] = useState(0)
	const increment = () => setCount(c => c + 1)
	return (
		<div>
			<button onClick={increment}>The count is {count}</button>
			{/* 🐨 interpolate the footer here rather than creating a new <Footer /> element every render */}
			<Footer color={color} />
		</div>
	)
}

function App() {
	const [color, setColor] = useState('black')
	return (
		<div>
			<div>
				<p>Set the footer color:</p>
				<div style={{ display: 'flex', gap: 4 }}>
					<button onClick={() => setColor('black')}>Black</button>
					<button onClick={() => setColor('blue')}>Blue</button>
					<button onClick={() => setColor('green')}>Green</button>
				</div>
			</div>
			{/* 🐨 pass the footer prop instead of the color prop */}
			<Main color={color} />
		</div>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)

import { useState } from 'react'
import * as ReactDOM from 'react-dom/client'

function Footer({ color }: { color: string }) {
	return <footer style={{ color }}>I am the ({color}) footer</footer>
}

// 💣 delete this variable
const footer = <Footer color="black" />

// 🐨 make the Main component accept a footer prop
function Main() {
	const [count, setCount] = useState(0)
	const increment = () => setCount(c => c + 1)
	return (
		<div>
			<button onClick={increment}>The count is {count}</button>
			{footer}
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
			{/* 🐨 pass the footer prop so you can dynamically determine the color */}
			<Main />
		</div>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)

/*
eslint
	@typescript-eslint/no-unused-vars: "off",
*/

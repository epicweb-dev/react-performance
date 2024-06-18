import { useState } from 'react'
import * as ReactDOM from 'react-dom/client'

function Footer() {
	return <footer>I am the footer</footer>
}

// 🐨 assign a <Footer /> to a footer variable here

function App() {
	const [count, setCount] = useState(0)
	const increment = () => setCount((c) => c + 1)
	return (
		<div>
			<button onClick={increment}>The count is {count}</button>
			{/* 🐨 change this to an interpolation and interpolate the footer */}
			<Footer />
		</div>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)

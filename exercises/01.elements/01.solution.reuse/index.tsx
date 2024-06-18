import { useState } from 'react'
import * as ReactDOM from 'react-dom/client'

function Footer() {
	return <footer>I am the footer</footer>
}

const footer = <Footer />

function App() {
	const [count, setCount] = useState(0)
	const increment = () => setCount((c) => c + 1)
	return (
		<div>
			<button onClick={increment}>The count is {count}</button>
			{footer}
		</div>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)

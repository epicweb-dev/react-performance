import { createContext, memo, use, useMemo, useState } from 'react'
import * as ReactDOM from 'react-dom/client'

const FooterContext = createContext<{ color: string; name: string } | null>(
	null,
)

function useFooter() {
	const context = use(FooterContext)
	if (!context) throw new Error('FooterContext not found')
	return context
}

const Footer = memo(function Footer() {
	const { color, name } = useFooter()
	return (
		<footer style={{ color }}>
			I am the ({color}) footer, {name}
		</footer>
	)
})

function Main({ footer }: { footer: React.ReactNode }) {
	const [count, setCount] = useState(0)
	const increment = () => setCount(c => c + 1)
	return (
		<div>
			<button onClick={increment}>The count is {count}</button>
			{footer}
		</div>
	)
}

function FooterSetters() {
	const setColor = (s: string) => {}
	const setName = (s: string) => {}
	return (
		<>
			<div>
				<p>Set the footer color:</p>
				<div style={{ display: 'flex', gap: 4 }}>
					<button onClick={() => setColor('black')}>Black</button>
					<button onClick={() => setColor('blue')}>Blue</button>
					<button onClick={() => setColor('green')}>Green</button>
				</div>
			</div>
			<div>
				<p>Set the footer name:</p>
				<label>
					Name:
					<input onChange={e => setName(e.currentTarget.value)} />
				</label>
			</div>
		</>
	)
}

function App() {
	const [color, setColor] = useState('black')
	const [name, setName] = useState('Kody')
	const [appCount, setAppCount] = useState(0)
	const value = useMemo(() => ({ color, name }), [color, name])
	return (
		<FooterContext.Provider value={value}>
			<div>
				<FooterSetters />
				<button onClick={() => setAppCount(c => c + 1)}>
					The app count is {appCount}
				</button>
				<Main footer={<Footer />} />
			</div>
		</FooterContext.Provider>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)

/*
eslint
	@typescript-eslint/no-unused-vars: "off",
*/

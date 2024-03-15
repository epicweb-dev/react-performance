import { createContext, memo, use, useMemo, useState } from 'react'
import * as ReactDOM from 'react-dom/client'

const FooterStateContext = createContext<{
	color: string
	name: string
} | null>(null)
FooterStateContext.displayName = 'FooterStateContext'

const FooterDispatchContext = createContext<{
	setColor: (color: string) => void
	setName: (name: string) => void
} | null>({
	setColor: () => {},
	setName: () => {},
})
FooterDispatchContext.displayName = 'FooterDispatchContext'

function FooterProvider({ children }: { children: React.ReactNode }) {
	const [color, setColor] = useState('black')
	const [name, setName] = useState('Kody')
	const footerStateValue = useMemo(() => ({ color, name }), [color, name])
	const footerDispatchValue = useMemo(() => ({ setColor, setName }), [])
	return (
		<FooterStateContext.Provider value={footerStateValue}>
			<FooterDispatchContext.Provider value={footerDispatchValue}>
				{children}
			</FooterDispatchContext.Provider>
		</FooterStateContext.Provider>
	)
}

function useFooterState() {
	const context = use(FooterStateContext)
	if (!context) throw new Error('FooterStateContext not found')
	return context
}

function useFooterDispatch() {
	const context = use(FooterDispatchContext)
	if (!context) throw new Error('FooterDispatchContext not found')
	return context
}

const Footer = memo(function Footer() {
	const { color, name } = useFooterState()
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

const FooterSetters = memo(function FooterSetters() {
	const { setColor, setName } = useFooterDispatch()
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
})

function App() {
	const [appCount, setAppCount] = useState(0)
	return (
		<FooterProvider>
			<div>
				<FooterSetters />
				<button onClick={() => setAppCount(c => c + 1)}>
					The app count is {appCount}
				</button>
				<Main footer={<Footer />} />
			</div>
		</FooterProvider>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)

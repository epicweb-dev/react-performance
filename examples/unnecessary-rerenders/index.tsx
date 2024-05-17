import { useState } from 'react'
import * as ReactDOM from 'react-dom/client'

function CountButton({
	count,
	onClick,
}: {
	count: number
	onClick: () => void
}) {
	return <button onClick={onClick}>{count}</button>
}

function NameInput({
	name,
	onNameChange,
}: {
	name: string
	onNameChange: (name: string) => void
}) {
	return (
		<label>
			Name:{' '}
			<input value={name} onChange={e => onNameChange(e.currentTarget.value)} />
		</label>
	)
}

function App() {
	const [name, setName] = useState('')
	const [count, setCount] = useState(0)
	const increment = () => setCount(c => c + 1)
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
			<div>
				<CountButton count={count} onClick={increment} />
			</div>
			<div>
				<NameInput name={name} onNameChange={setName} />
			</div>
			{name ? <div>{`${name}'s favorite number is ${count}`}</div> : null}
		</div>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)

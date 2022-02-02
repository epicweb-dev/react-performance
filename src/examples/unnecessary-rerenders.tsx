// http://localhost:3000/isolated/examples/unnecessary-rerenders.js

import * as React from 'react'

type ICountButtonProps = {
  count: number
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

type INameInputProps = {
  name: string
  onNameChange: (changedName: string) => void
}

const CountButton = ({count, onClick}: ICountButtonProps) => {
  return <button onClick={onClick}>{count}</button>
}

const NameInput = ({name, onNameChange}: INameInputProps) => {
  return (
    <label>
      Name: <input value={name} onChange={e => onNameChange(e.target.value)} />
    </label>
  )
}

const Example = () => {
  const [name, setName] = React.useState('')
  const [count, setCount] = React.useState(0)
  const increment = () => setCount(c => c + 1)
  return (
    <div>
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

export default Example

/*
eslint
  no-func-assign: 0,
*/

import { useMemo, useState } from 'react'
import { searchItems } from './cities'
import './index.css'
import { useCombobox, useForceRerender } from './utils'

export function App() {
	const forceRerender = useForceRerender()
	const [inputValue, setInputValue] = useState('')

	const items = useMemo(
		() => searchItems(inputValue).slice(0, 500),
		[inputValue],
	)

	const {
		selectedItem,
		highlightedIndex,
		getInputProps,
		getItemProps,
		getLabelProps,
		getMenuProps,
		selectItem,
	} = useCombobox({
		items,
		inputValue,
		onInputValueChange: ({ inputValue: newValue = '' }) =>
			setInputValue(newValue),
		onSelectedItemChange: ({ selectedItem }) =>
			alert(
				selectedItem
					? `You selected ${selectedItem.name}`
					: 'Selection Cleared',
			),
		itemToString: item => (item ? item.name : ''),
	})

	return (
		<div className="city-app">
			<button onClick={forceRerender}>force rerender</button>
			<div>
				<label {...getLabelProps()}>Find a city</label>
				<div>
					<input {...getInputProps({ type: 'text' })} />
					<button onClick={() => selectItem(null)} aria-label="toggle menu">
						&#10005;
					</button>
				</div>
				<ul {...getMenuProps()}>
					{items.map((item, index) => {
						const isSelected = selectedItem?.id === item.id
						const isHighlighted = highlightedIndex === index
						return (
							<li
								key={item.id}
								{...getItemProps({
									index,
									item,
									style: {
										fontWeight: isSelected ? 'bold' : 'normal',
										backgroundColor: isHighlighted ? 'lightgray' : 'inherit',
									},
								})}
							>
								{item.name}
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}

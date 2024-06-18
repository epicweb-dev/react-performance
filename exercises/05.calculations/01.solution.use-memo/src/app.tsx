import { useMemo, useState } from 'react'
import { searchCities } from './cities/index.ts'
import './index.css'
import { useCombobox, useForceRerender } from './utils'

export function App() {
	const forceRerender = useForceRerender()
	const [inputValue, setInputValue] = useState('')

	const cities = useMemo(
		() => searchCities(inputValue).slice(0, 500),
		[inputValue],
	)

	const {
		selectedItem: selectedCity,
		highlightedIndex,
		getInputProps,
		getItemProps,
		getLabelProps,
		getMenuProps,
		selectItem,
	} = useCombobox({
		items: cities,
		inputValue,
		onInputValueChange: ({ inputValue: newValue = '' }) =>
			setInputValue(newValue),
		onSelectedItemChange: ({ selectedItem: selectedCity }) =>
			alert(
				selectedCity
					? `You selected ${selectedCity.name}`
					: 'Selection Cleared',
			),
		itemToString: (city) => (city ? city.name : ''),
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
					{cities.map((city, index) => {
						const isSelected = selectedCity?.id === city.id
						const isHighlighted = highlightedIndex === index
						return (
							<li
								key={city.id}
								{...getItemProps({
									index,
									item: city,
									style: {
										fontWeight: isSelected ? 'bold' : 'normal',
										backgroundColor: isHighlighted ? 'lightgray' : 'inherit',
									},
								})}
							>
								{city.name}
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}

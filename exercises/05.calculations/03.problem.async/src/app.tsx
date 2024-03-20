import { useMemo, useState } from 'react'
// 💣 remove this import
import { searchCities } from './cities/legacy'
// 🐨 get searchCities from this import
import './cities/index.ts'
import './index.css'
import { useCombobox, useForceRerender } from './utils'

// 🐨 create a variable called initialCitiesPromise and call searchCities here
// 💰 NOTE: do NOT await the call. You're getting the promise, not the result!

// 🐨 export a new component called App (you'll rename the one below)
// - App should render a Suspense boundary with a fallback of "Loading..."
// - In the suspense boundary, render the CityChooser component

// 🐨 rename this component to CityChooser
export function App() {
	const forceRerender = useForceRerender()
	// 🐨 add a useTransition here
	const [inputValue, setInputValue] = useState('')
	// 🐨 create a new state here called citiesPromise with the initial state set to initialCitiesPromise

	// 🐨 get rid of this useMemo and instead call use(citiesPromise) to get the cities
	const cities = useMemo(
		() => searchCities(inputValue).slice(0, 500),
		[inputValue],
	)

	// 💯 as extra credit, use spin-delay to avoid a flash of pending state

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
		onInputValueChange: ({ inputValue: newValue = '' }) => {
			setInputValue(newValue)
			// 🐨 start a transition here and in the transition callback, call
			// searchCities(newValue) and set the citiesPromise state to that promise
		},
		onSelectedItemChange: ({ selectedItem: selectedCity }) =>
			alert(
				selectedCity
					? `You selected ${selectedCity.name}`
					: 'Selection Cleared',
			),
		itemToString: city => (city ? city.name : ''),
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
				{/* 🐨 add opacity of 0.6 if we're currently pending */}
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

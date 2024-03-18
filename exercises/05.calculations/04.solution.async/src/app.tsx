import { Suspense, use, useState, useTransition } from 'react'
import { useSpinDelay } from 'spin-delay'
import { searchCities } from './cities'
import './index.css'
import { useCombobox, useForceRerender } from './utils'

const initialCitiesPromise = searchCities('')

export function App() {
	return (
		<Suspense fallback="Loading...">
			<CityChooser />
		</Suspense>
	)
}

function CityChooser() {
	const forceRerender = useForceRerender()
	const [isTransitionPending, startTransition] = useTransition()
	const [inputValue, setInputValue] = useState('')
	const [citiesPromise, setCitiesPromise] = useState(initialCitiesPromise)
	const cities = use(citiesPromise)

	const isPending = useSpinDelay(isTransitionPending)

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
			startTransition(() => {
				setCitiesPromise(searchCities(newValue))
			})
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
				<ul {...getMenuProps({ style: { opacity: isPending ? 0.6 : 1 } })}>
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

import { useVirtualizer } from '@tanstack/react-virtual'
import { type UseComboboxPropGetters } from 'downshift'
import { Suspense, memo, use, useRef, useState, useTransition } from 'react'
import { useSpinDelay } from 'spin-delay'
import { searchCities } from './cities/index.ts'
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

	const parentRef = useRef<HTMLUListElement>(null)

	const rowVirtualizer = useVirtualizer({
		count: cities.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 20,
	})

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
		scrollIntoView: () => {},
		onHighlightedIndexChange: ({ highlightedIndex }) => {
			if (highlightedIndex === undefined || highlightedIndex === -1) return
			rowVirtualizer.scrollToIndex(highlightedIndex)
		},
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
				<ul
					{...getMenuProps({
						ref: parentRef,
						style: {
							opacity: isPending ? 0.6 : 1,
							position: 'relative',
						},
					})}
				>
					<li style={{ height: `${rowVirtualizer.getTotalSize()}px` }} />
					{rowVirtualizer.getVirtualItems().map(virtualItem => {
						const city = cities[virtualItem.index]
						if (!city) return null
						const { index, key, start, size } = virtualItem
						const isSelected = selectedCity?.id === city.id
						const isHighlighted = highlightedIndex === index
						return (
							<ListItem
								key={key}
								index={index}
								isSelected={isSelected}
								isHighlighted={isHighlighted}
								city={city}
								getItemProps={getItemProps}
								size={size}
								start={start}
							/>
						)
					})}
				</ul>
			</div>
		</div>
	)
}

const ListItem = memo(function ListItem<
	City extends { id: string; name: string },
>({
	index,
	city,
	isSelected,
	isHighlighted,
	getItemProps,
	start,
	size,
}: {
	index: number
	city: City
	isSelected: boolean
	isHighlighted: boolean
	getItemProps: UseComboboxPropGetters<City>['getItemProps']
	start: number
	size: number
}) {
	return (
		<li
			key={city.id}
			{...getItemProps({
				index,
				item: city,
				style: {
					fontWeight: isSelected ? 'bold' : 'normal',
					backgroundColor: isHighlighted ? 'lightgray' : 'inherit',
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: `${size}px`,
					transform: `translateY(${start}px)`,
				},
			})}
		>
			{city.name}
		</li>
	)
})

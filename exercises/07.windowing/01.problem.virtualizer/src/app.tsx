import { type UseComboboxPropGetters } from 'downshift'
import { Suspense, memo, use, useState, useTransition } from 'react'
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

	// 🐨 create a ref here for HTMLDivElement

	// 🐨 create a rowVirtualizer with useVirtualizer from "@tanstack/react-virtual"
	// - the count should be the length of the items
	// - the getScrollElement should return the ref you created above
	// - the estimateSize callback should return 20

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
		// 🦉 we want to override Downshift's scrollIntoView functionality because
		// the virtualizer will handle scrolling for us as the user uses the arrow keys:

		// 🐨 set scrollIntoView to a "no-op" function
		// 💰 "no-op" means "no operation" or "a function that does nothing"... So: () => {}

		// 🐨 when the highlightedIndex changes, then tell the virtualizer to scroll
		// to that index.
		// 💰 because you're not here to learn the downshift API I'm just gonna give
		// this stuff to you. It's the concepts you're here to learn!
		// scrollIntoView: () => {},
		// onHighlightedIndexChange: ({ highlightedIndex }) => {
		// 	if (highlightedIndex === undefined || highlightedIndex === -1) return
		// 	rowVirtualizer.scrollToIndex(highlightedIndex)
		// },
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
						// 🐨 add the ref to the ul
						style: {
							opacity: isPending ? 0.6 : 1,
							position: 'relative',
						},
					})}
				>
					{/*
						🦉 to make this ul have a scrollbar that makes it appear we're
						rendering all items, we're going to toss in an invisible element
						that's really tall.
						🐨 add an <li /> with no content that has a height equal to the
						total size of the scrollable list (💰 `${rowVirtualizer.getTotalSize()}px`)
					*/}

					{/* 🐨 change this to map over rowVirtualizer.getVirtualItems() */}
					{/* 💰 you'll no longer need the index from the map, you'll get it from the virtualItem instead */}
					{cities.map((city, index) => {
						// 🐨 get the item from items[virtualItem.index]
						// 🐨 get the index, key, size, and start from the virtualItem
						const isSelected = selectedCity?.id === city.id
						const isHighlighted = highlightedIndex === index
						return (
							<ListItem
								// 🐨 use the key from the virtualItem here
								key={city.id}
								// 🐨 use the index from the virtualItem here
								index={index}
								isSelected={isSelected}
								isHighlighted={isHighlighted}
								city={city}
								getItemProps={getItemProps}
								// 🐨 add start and size props here (from the virtualItem)
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
	// 🐨 accept start and size props here
}: {
	index: number
	city: City
	isSelected: boolean
	isHighlighted: boolean
	getItemProps: UseComboboxPropGetters<City>['getItemProps']
	// 🐨 add start and size props (both are a number)
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
					// 💰 add the following CSS so it can be virtually positioned properly:
					// position: 'absolute',
					// top: 0,
					// left: 0,
					// width: '100%',
					// 🐨 add a height that's the ${size}px
					// 🐨 add a transform that's translateY(${start}px)
				},
			})}
		>
			{city.name}
		</li>
	)
})

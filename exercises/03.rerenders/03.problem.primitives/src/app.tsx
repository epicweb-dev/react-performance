import { type UseComboboxPropGetters } from 'downshift'
import { memo, useEffect, useState } from 'react'
import { useSpinDelay } from 'spin-delay'
import { searchItems } from './cities'
import './index.css'
import { useAsync, useCombobox, useForceRerender } from './utils'

type Cities = Awaited<ReturnType<typeof searchItems>>
type City = Cities[number]

export function App() {
	const forceRerender = useForceRerender()
	const [inputValue, setInputValue] = useState('')

	const { data: allItems, run, status } = useAsync<Cities>()
	useEffect(() => {
		run(searchItems(inputValue))
	}, [inputValue, run])
	const items = allItems ?? []
	const isPending = useSpinDelay(status === 'pending')

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
		onInputValueChange: ({ inputValue: newValue = '' }) => {
			setInputValue(newValue)
		},
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
				<ul
					{...getMenuProps({
						style: { opacity: isPending ? 0.6 : 1 },
					})}
				>
					{items.map((item, index) => {
						// 🐨 compute the isHighlighted and isSelected states here and pass them as props
						return (
							<ListItem
								key={item.id}
								index={index}
								// 💣 remove this prop
								selectedItem={selectedItem}
								// 💣 remove this prop
								highlightedIndex={highlightedIndex}
								item={item}
								getItemProps={getItemProps}
							/>
						)
					})}
				</ul>
			</div>
		</div>
	)
}

const ListItem = memo(
	function ListItem({
		index,
		item,
		selectedItem,
		highlightedIndex,
		getItemProps,
	}: {
		index: number
		item: Cities[number]
		// 🐨 remove this and replace it with an isSelected prop
		selectedItem: Cities[number] | null
		// 🐨 remove this and replace it with an isHighlighted prop
		highlightedIndex: number
		getItemProps: UseComboboxPropGetters<City>['getItemProps']
	}) {
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
	},
	// 💣 remove this custom comparator
	(prevProps, nextProps) => {
		const prevIsSelected = prevProps.selectedItem?.id === prevProps.item.id
		const nextIsSelected = nextProps.selectedItem?.id === nextProps.item.id
		const prevIsHighlighted = prevProps.highlightedIndex === prevProps.index
		const nextIsHighlighted = nextProps.highlightedIndex === nextProps.index
		return (
			prevProps.index === nextProps.index &&
			prevProps.item === nextProps.item &&
			prevIsSelected === nextIsSelected &&
			prevIsHighlighted === nextIsHighlighted
		)
	},
)

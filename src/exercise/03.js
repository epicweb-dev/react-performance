// React.memo for reducing unnecessary re-renders
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'
import {useCombobox} from '../use-combobox'
import {getItems} from '../workerized-filter-cities'
import {useAsync, useForceRerender} from '../utils'

function Menu({
  items,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
}) {
  return (
    <ul {...getMenuProps()}>
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          getItemProps={getItemProps}
          item={item}
          index={index}
          isSelected={selectedItem?.id === item.id}
          isHighlighted={highlightedIndex === index}
        >
          {item.name}
        </ListItem>
      ))}
    </ul>
  )
}
Menu = React.memo(Menu)
// render time before memo: 5ms total
// render time after memo: 0.6ms total

function ListItem({
  getItemProps,
  item,
  index,
  isSelected,
  isHighlighted,
  ...props
}) {
  return (
    <li
      {...getItemProps({
        index,
        item,
        style: {
          fontWeight: isSelected ? 'bold' : 'normal',
          backgroundColor: isHighlighted ? 'lightgray' : 'inherit',
        },
        ...props,
      })}
    />
  )
}
ListItem = React.memo(ListItem)
// function arePropsEqual(oldProps, newProps) {
//   const isOldHighlightedItem =
//     oldProps.highlightedIndex === oldProps.index &&
//     newProps.highlightedIndex !== newProps.index

//   const isNewHighlightedItem =
//     oldProps.highlightedIndex !== oldProps.index &&
//     newProps.highlightedIndex === newProps.index

//   if (isOldHighlightedItem || isNewHighlightedItem) return false
//   else return true
// }
// render time before memo: 0.1-1.3ms for each, 5ms total
// render time after memo: 0ms
// render time before custom comparision function: 4ms
// render time after custom comparision function: 0.1ms

function App() {
  const forceRerender = useForceRerender()
  const [inputValue, setInputValue] = React.useState('')

  const {data: allItems, run} = useAsync({data: [], status: 'pending'})
  React.useEffect(() => {
    run(getItems(inputValue))
  }, [inputValue, run])
  const items = allItems.slice(0, 100)

  const {
    selectedItem,
    highlightedIndex,
    getComboboxProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    selectItem,
  } = useCombobox({
    items,
    inputValue,
    onInputValueChange: ({inputValue: newValue}) => setInputValue(newValue),
    onSelectedItemChange: ({selectedItem}) =>
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
        <div {...getComboboxProps()}>
          <input {...getInputProps({type: 'text'})} />
          <button onClick={() => selectItem(null)} aria-label="toggle menu">
            &#10005;
          </button>
        </div>
        <Menu
          items={items}
          getMenuProps={getMenuProps}
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          selectedItem={selectedItem}
        />
      </div>
    </div>
  )
}

export default App

/*
eslint
  no-func-assign: 0,
*/

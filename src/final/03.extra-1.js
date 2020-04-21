// React.memo for reducing unnecessary re-renders
// 💯 Use a custom comparator function
// http://localhost:3000/isolated/final/03.extra-1.js

import React from 'react'
import OriginalDownshift from 'downshift'
import {getItems} from '../workerized-filter-cities'
import {useAsync, useForceRerender} from '../utils'

function Menu({
  getMenuProps,
  inputValue,
  getItemProps,
  highlightedIndex,
  selectedItem,
  setItemCount,
}) {
  const {data: items = []} = useAsync(
    React.useCallback(() => getItems(inputValue), [inputValue]),
  )
  const itemsToRender = items.slice(0, 100)
  setItemCount(itemsToRender.length)
  return (
    <ul
      {...getMenuProps({
        style: {
          width: 300,
          height: 300,
          overflowY: 'scroll',
          backgroundColor: '#eee',
          padding: 0,
          listStyle: 'none',
        },
      })}
    >
      {itemsToRender.map((item, index) => (
        <ListItem
          key={item.id}
          getItemProps={getItemProps}
          items={items}
          highlightedIndex={highlightedIndex}
          selectedItem={selectedItem}
          index={index}
        />
      ))}
    </ul>
  )
}
Menu = React.memo(Menu)

function ListItem({
  getItemProps,
  items,
  highlightedIndex,
  selectedItem,
  index,
}) {
  const item = items[index]
  return (
    <li
      {...getItemProps({
        index,
        item,
        style: {
          backgroundColor: highlightedIndex === index ? 'lightgray' : 'inherit',
          fontWeight:
            selectedItem && selectedItem.id === item.id ? 'bold' : 'normal',
        },
      })}
    >
      {item.name}
    </li>
  )
}
ListItem = React.memo(ListItem, (prevProps, nextProps) => {
  // true means do NOT rerender
  // false means DO rerender

  // these ones are easy if any of these changed, we should re-render
  if (prevProps.getItemProps !== nextProps.getItemProps) return false
  if (prevProps.items !== nextProps.items) return false
  if (prevProps.index !== nextProps.index) return false
  if (prevProps.selectedItem !== nextProps.selectedItem) return false

  // this is trickier. We should only re-render if this list item:
  // 1. was highlighted before and now it's not
  // 2. was not highlighted before and now it is
  if (prevProps.highlightedIndex !== nextProps.highlightedIndex) {
    const wasPrevHighlighted = prevProps.highlightedIndex === prevProps.index
    const isNowHighlighted = nextProps.highlightedIndex === nextProps.index
    return wasPrevHighlighted === isNowHighlighted
  }
  return true
})

const Downshift = React.memo(OriginalDownshift)

const itemToString = item => (item ? item.name : '')
function handleChange(selection) {
  alert(selection ? `You selected ${selection.name}` : 'Selection Cleared')
}

function downshiftChildren({
  getInputProps,
  getItemProps,
  getLabelProps,
  getMenuProps,
  isOpen,
  inputValue,
  highlightedIndex,
  selectedItem,
  setItemCount,
}) {
  return (
    <div>
      <div>
        <label {...getLabelProps()}>Find a city</label>
        <div>
          <input {...getInputProps({type: 'text'})} />
        </div>
      </div>
      <Menu
        getMenuProps={getMenuProps}
        inputValue={inputValue}
        getItemProps={getItemProps}
        highlightedIndex={highlightedIndex}
        selectedItem={selectedItem}
        setItemCount={setItemCount}
      />
    </div>
  )
}

function App() {
  const forceRerender = useForceRerender()

  return (
    <>
      <button onClick={forceRerender}>force rerender</button>
      <Downshift onChange={handleChange} itemToString={itemToString}>
        {downshiftChildren}
      </Downshift>
    </>
  )
}

export default App
/*
eslint
  no-func-assign: 0,
*/

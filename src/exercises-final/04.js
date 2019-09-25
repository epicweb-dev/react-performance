// TODO

import React from 'react'
import Downshift from 'downshift'
import {FixedSizeList as List} from 'react-window'
import cities from '../us-cities.json'

const allItems = cities.map((city, index) => ({
  ...city,
  lowerName: city.name.toLowerCase(),
  id: String(index),
}))

function getItems(filter) {
  if (!filter) {
    return allItems
  }
  const filteredItems = []
  const lowerFilter = filter.toLowerCase()
  for (let i = 0; i < allItems.length; i++) {
    const city = allItems[i]
    const index = city.lowerName.indexOf(lowerFilter)
    if (index >= 0) {
      filteredItems[index] = filteredItems[index] || []
      filteredItems[index].push(city)
    }
  }
  let final = []
  for (const index in filteredItems) {
    final = final.concat(filteredItems[index])
  }
  return final
}

// function getItemsSlow(filter) {
//   return filter
//     ? allItems
//         .reduce((acc, city) => {
//           const index = city.name.toLowerCase().indexOf(filter.toLowerCase())
//           acc[index] = acc[index] || []
//           acc[index].push(city)
//           return acc
//         }, [])
//         .reduce((acc, cities) => [...acc, ...cities], [])
//     : allItems
// }

function ListItem({
  data: {getItemProps, items, highlightedIndex, selectedItem},
  index,
  style,
}) {
  const item = items[index]
  return (
    <li
      {...getItemProps({
        index,
        item,
        style: {
          ...style,
          backgroundColor: highlightedIndex === index ? 'lightgray' : 'inherit',
          fontWeight: selectedItem === item ? 'bold' : 'normal',
        },
      })}
    >
      {item.name}
    </li>
  )
}

function Menu({
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
  isOpen,
  inputValue,
  listRef,
  items,
}) {
  return (
    <ul
      {...getMenuProps({
        style: {
          width: 300,
          height: 300,
          backgroundColor: '#eee',
          padding: 0,
          listStyle: 'none',
        },
      })}
    >
      <List
        ref={listRef}
        width={300}
        height={300}
        itemCount={items.length}
        itemSize={20}
        itemData={{
          getItemProps,
          items,
          highlightedIndex,
          selectedItem,
        }}
      >
        {ListItem}
      </List>
    </ul>
  )
}

function useForceRerender() {
  const [, set] = React.useState()
  return React.useCallback(() => set({}), [])
}

const itemToString = item => (item ? item.name : '')
function handleChange(selection) {
  alert(selection ? `You selected ${selection.name}` : 'Selection Cleared')
}

const PureDownshift = React.memo(Downshift)

function FilterComponent() {
  const listRef = React.useRef()
  const [items, setItems] = React.useState(allItems)

  const forceRerender = useForceRerender()

  // React.useEffect(() => {
  //   let timeout = setTimeout(() => forceRerender, 500)
  //   return () => clearTimeout(timeout)
  // }, [forceRerender])

  const handleStateChange = React.useCallback(function handleStateChange(
    changes,
    downshiftState,
  ) {
    if (changes.hasOwnProperty('inputValue')) {
      performance.mark('getting items')
      const gotItems = getItems(changes.inputValue)
      performance.mark('got items')
      performance.measure('getItems call', 'getting items', 'got items')
      setItems(gotItems)
    }
    if (changes.hasOwnProperty('highlightedIndex') && listRef.current) {
      listRef.current.scrollToItem(changes.highlightedIndex)
    }
  },
  [])

  const downshiftChildren = React.useCallback(
    ({
      getInputProps,
      getItemProps,
      getLabelProps,
      getMenuProps,
      isOpen,
      inputValue,
      highlightedIndex,
      selectedItem,
    }) => (
      <div>
        <div>
          <label {...getLabelProps()}>Find a city</label>
          <div>
            <input {...getInputProps()} />
          </div>
        </div>
        <Menu
          items={items}
          getMenuProps={getMenuProps}
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          selectedItem={selectedItem}
          isOpen={isOpen}
          inputValue={inputValue}
          listRef={listRef}
        />
      </div>
    ),
    [items],
  )

  return (
    <>
      <button onClick={forceRerender}>force rerender</button>
      <PureDownshift
        itemCount={items.length}
        onStateChange={handleStateChange}
        onChange={handleChange}
        itemToString={itemToString}
      >
        {downshiftChildren}
      </PureDownshift>
    </>
  )
}

/*
🦉 Elaboration & Feedback
After the instruction, copy the URL below into your browser and fill out the form:
http://ws.kcd.im/?ws=React%20Performance&e=TODO&em=
*/

////////////////////////////////////////////////////////////////////
//                                                                //
//                 Don't make changes below here.                 //
// But do look at it to see how your code is intended to be used. //
//                                                                //
////////////////////////////////////////////////////////////////////

function Usage() {
  return <FilterComponent />
}
Usage.title = 'TODO'

export default Usage

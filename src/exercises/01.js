// TODO

import React from 'react'
import Downshift from 'downshift'
import {FixedSizeList as List} from 'react-window'
import cities from '../us-cities.json'

const allItems = cities.map((city, index) => ({...city, id: String(index)}))

function getItems(filter) {
  return filter
    ? allItems
        .reduce((acc, city) => {
          const index = city.name.toLowerCase().indexOf(filter.toLowerCase())
          acc[index] = acc[index] || []
          acc[index].push(city)
          return acc
        }, [])
        .reduce((acc, cities) => [...acc, ...cities], [])
    : allItems
}

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

function FilterComponent() {
  const listRef = React.useRef()
  const [items, setItems] = React.useState(allItems)

  const forceRerender = useForceRerender()

  React.useEffect(() => {
    let timeout = setTimeout(() => forceRerender, 500)
    return () => clearTimeout(timeout)
  }, [forceRerender])

  function handleStateChange(changes, downshiftState) {
    if (changes.hasOwnProperty('inputValue')) {
      setItems(getItems(changes.inputValue))
    }
    if (changes.hasOwnProperty('highlightedIndex') && listRef.current) {
      listRef.current.scrollToItem(changes.highlightedIndex)
    }
  }

  return (
    <>
      <button onClick={forceRerender}>force rerender</button>
      <Downshift
        itemCount={items.length}
        onStateChange={handleStateChange}
        onChange={selection =>
          alert(
            selection ? `You selected ${selection.name}` : 'Selection Cleared',
          )
        }
        itemToString={item => (item ? item.name : '')}
      >
        {({
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
        )}
      </Downshift>
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

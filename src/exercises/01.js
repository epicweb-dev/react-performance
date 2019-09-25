// useMemo for expensive calculations

import React from 'react'
import Downshift from 'downshift'
import matchSorter from 'match-sorter'
import cities from '../us-cities.json'

function Menu({
  getMenuProps,
  inputValue,
  getItemProps,
  highlightedIndex,
  selectedItem,
}) {
  // 🐨 wrap getItems in a call to `React.useMemo`
  const items = getItems(inputValue).slice(0, 100)
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
      {items.map((item, index) => (
        <li
          {...getItemProps({
            key: item.id,
            index,
            item,
            style: {
              backgroundColor:
                highlightedIndex === index ? 'lightgray' : 'inherit',
              fontWeight: selectedItem === item ? 'bold' : 'normal',
            },
          })}
        >
          {item.name}
        </li>
      ))}
    </ul>
  )
}

/*
🦉 Elaboration & Feedback
After the instruction, copy the URL below into your browser and fill out the form:
http://ws.kcd.im/?ws=React%20Performance&e=useMemo&em=
*/

////////////////////////////////////////////////////////////////////
//                                                                //
//                 Don't make changes below here.                 //
// But do look at it to see how your code is intended to be used. //
//                                                                //
////////////////////////////////////////////////////////////////////

const allItems = cities.map((city, index) => ({
  ...city,
  id: String(index),
}))

function getItems(filter) {
  if (!filter) {
    return allItems
  }
  return matchSorter(allItems, filter, {
    keys: ['name'],
  })
}

function useForceRerender() {
  const [, set] = React.useState()
  return React.useCallback(() => set({}), [])
}

function FilterComponent() {
  const forceRerender = useForceRerender()

  return (
    <>
      <button onClick={forceRerender}>force rerender</button>
      <Downshift
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
              getMenuProps={getMenuProps}
              inputValue={inputValue}
              getItemProps={getItemProps}
              highlightedIndex={highlightedIndex}
              selectedItem={selectedItem}
            />
          </div>
        )}
      </Downshift>
    </>
  )
}

function Usage() {
  return <FilterComponent />
}
Usage.title = 'useMemo for expensive calculations'

export default Usage

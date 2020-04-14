// Window large lists with react-window
// http://localhost:3000/isolated/final/04.js

import React from 'react'
import Downshift from 'downshift'
import {FixedSizeList as List} from 'react-window'
import {getItems} from '../workerized-filter-cities'
import {useAsync, useForceRerender} from '../utils'

function Menu({
  getMenuProps,
  inputValue,
  getItemProps,
  highlightedIndex,
  selectedItem,
  setItemCount,
  listRef,
}) {
  const {data: items = []} = useAsync(
    React.useCallback(() => getItems(inputValue), [inputValue]),
  )
  setItemCount(items.length)
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
Menu = React.memo(Menu)

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
          fontWeight:
            selectedItem && selectedItem.id === item.id ? 'bold' : 'normal',
        },
      })}
    >
      {item.name}
    </li>
  )
}

function App() {
  const forceRerender = useForceRerender()
  const listRef = React.useRef()

  function handleStateChange(changes, downshiftState) {
    if (changes.hasOwnProperty('highlightedIndex') && listRef.current) {
      listRef.current.scrollToItem(changes.highlightedIndex)
    }
  }

  return (
    <>
      <button onClick={forceRerender}>force rerender</button>
      <Downshift
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
          setItemCount,
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
              setItemCount={setItemCount}
              listRef={listRef}
            />
          </div>
        )}
      </Downshift>
    </>
  )
}

export default App
/*
eslint
  no-func-assign: 0,
*/

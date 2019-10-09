// Window large lists with react-window

// http://localhost:3000/isolated/exercises/04

import React from 'react'
import Downshift from 'downshift'
// 🐨 import react-window's FixedSizeList here
// 💰 import {FixedSizeList as List} from 'react-window'
import {getItems} from '../workerized-filter-cities'
import {useAsync, useForceRerender} from '../utils'

function Menu({
  getMenuProps,
  inputValue,
  getItemProps,
  highlightedIndex,
  selectedItem,
  setItemCount,
  // 🐨 accept a prop called "listRef" here
  // 💰 I gave you a bit of code to pass the listRef prop here.
  // You can peek down below in the FilterComponent and I'll explain what I did.
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
      {/* 💣 remove this items.map call */}
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          getItemProps={getItemProps}
          items={items}
          highlightedIndex={highlightedIndex}
          selectedItem={selectedItem}
          index={index}
        />
      ))}
      {/*
        🐨 render the FixedSizeList component here and pass ListItem as children.
        💰 Here are the props you'll want:
           ref (listItem)
           width (300)
           height (300)
           itemCount (items.length)
           itemSize (20)
           itemData (all the other props we currently have on the ListItem)
        💰 quick note that react-window accepts your component definition as a prop.
           which may seem strange, so it'll be something like this: <List>{ListItem}</List>
      */}
    </ul>
  )
}
Menu = React.memo(Menu)

function ListItem({
  // ListItem will now be rendered by react-window and most of the props we
  // were accepting before will now be passed into an object prop called "data"
  // 🐨 rewrite this so the following props are properties of a new "data" prop:
  // getItemProps, items, highlightedIndex, selectedItem
  getItemProps,
  items,
  highlightedIndex,
  selectedItem,
  index,
  // 🐨 accept a new style prop
}) {
  const item = items[index]
  return (
    <li
      {...getItemProps({
        index,
        item,
        style: {
          // spread the style object onto this object to merge the styles
          // react-window wants to pass with the ones we want to define.
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

/*
🦉 Elaboration & Feedback
After the instruction, copy the URL below into your browser and fill out the form:
http://ws.kcd.im/?ws=React%20Performance&e=windowing&em=
*/

////////////////////////////////////////////////////////////////////
//                                                                //
//                 Don't make changes below here.                 //
// But do look at it to see how your code is intended to be used. //
//                                                                //
////////////////////////////////////////////////////////////////////

function FilterComponent() {
  const forceRerender = useForceRerender()
  // 💰 I made this listRef for you and pass it as a prop to the Menu
  const listRef = React.useRef()

  // 💰 whenever Downshift experiences a state change, it'll call this function
  // and we use this to interact with react-window's listRef to scroll to
  // a specific index if Downshift's highlightedIndex changes.
  // I figured making you do this yourself would just be busy work and not
  // really help you learn how to tune your apps for performance, so that's why
  // I did it for you.
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
              // 💰 Here's where I added the listRef prop
              listRef={listRef}
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

export default Usage

/*
eslint
  no-func-assign: 0,
*/

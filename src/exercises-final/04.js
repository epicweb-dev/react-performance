// TODO

import React from 'react'
import Downshift from 'downshift'
import {FixedSizeList as List} from 'react-window'
import filterCitiesWorker from 'workerize!../filter-cities'
import {useAsync} from '../utils'

const {getItems} = filterCitiesWorker()

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
  setItemCount,
}) {
  const {data: items} = useAsync(
    React.useCallback(() => getItems(inputValue), [inputValue]),
  )
  const itemCount = items ? items.length : 0
  setItemCount(itemCount)
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
        itemCount={itemCount}
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

  const forceRerender = useForceRerender()

  // React.useEffect(() => {
  //   let timeout = setTimeout(() => forceRerender, 500)
  //   return () => clearTimeout(timeout)
  // }, [forceRerender])

  const handleStateChange = React.useCallback(function handleStateChange(
    changes,
    downshiftState,
  ) {
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
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          selectedItem={selectedItem}
          isOpen={isOpen}
          inputValue={inputValue}
          listRef={listRef}
          setItemCount={setItemCount}
        />
      </div>
    ),
    [],
  )

  return (
    <>
      <button onClick={forceRerender}>force rerender</button>
      <PureDownshift
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

/*
eslint
  import/no-webpack-loader-syntax:0
*/

// Window large lists with react-virtual
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
// 🐨 import the useVirtual hook from react-virtual
// import {useVirtual} from 'react-virtual'
import {useCombobox} from '../use-combobox'
import {getItems} from '../workerized-filter-cities'
import {useAsync, useForceRerender} from '../utils'
import {
  UseComboboxGetMenuPropsOptions,
  GetPropsCommonOptions,
  UseComboboxGetItemPropsOptions,
} from 'downshift'
import {UnpackArray} from '../types'

type Items = ReturnType<typeof getItems>

type IMenuProps = {
  items: Items
  getMenuProps: (
    options?: UseComboboxGetMenuPropsOptions,
    otherOptions?: GetPropsCommonOptions,
  ) => any
  getItemProps: (
    options: UseComboboxGetItemPropsOptions<{
      id: string
      country: string
      name: string
      lat: string
      lng: string
    }>,
  ) => any
  highlightedIndex: number
  selectedItem: UnpackArray<Items> | null
}

type IListItemProps = Pick<IMenuProps, 'getItemProps'> & {
  item: UnpackArray<Items>
  index: number
  isHighlighted: boolean
  isSelected: boolean
  children: React.ReactNode
}

// 💰 I made this for you, you'll need it later:
const getVirtualRowStyles = ({
  size,
  start,
}: {
  size: number
  start: number
}): React.CSSProperties => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: size,
  transform: `translateY(${start}px)`,
})

const Menu = ({
  items,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
}: IMenuProps) => {
  return (
    // 🐨 pass the listRef to the `getMenuProps` prop getter function below:
    // 💰  getMenuProps({ref: listRef})
    <ul {...getMenuProps()}>
      {/* 🐨 add a li here with an inline style for the height set to the totalHeight */}
      {/*
        🦉 this is to ensure that the scrollable area of the <ul /> is the
        same height it would be if we were actually rendering everything
      */}
      {/* instead of mapping the "items" we're going to map over the virtualRows */}
      {/* 🐨 swap `items` with `virtualRows` */}
      {/*
        💰 a virtual row is an object with the following properties:
        - index: you can use this to get the `item` via `items[index]`
        - size: set the "height" style to this value
        - start: this is how many pixels from the scrollTop this item should be
      */}
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          getItemProps={getItemProps}
          item={item}
          index={index}
          isSelected={selectedItem?.id === item.id}
          isHighlighted={highlightedIndex === index}
          // 🐨 pass a style prop, you can get the inline styles from getVirtualRowStyles()
          // make sure to pass an object with the size (the height of the row)
          // and start (where the row starts relative to the scrollTop of its container).
        >
          {item.name}
        </ListItem>
      ))}
    </ul>
  )
}

const ListItem = ({
  getItemProps,
  item,
  index,
  isHighlighted,
  isSelected,
  // 🐨 accept the style prop
  ...props
}: IListItemProps) => {
  return (
    <li
      {...getItemProps({
        index,
        item,
        style: {
          backgroundColor: isHighlighted ? 'lightgray' : 'inherit',
          fontWeight: isSelected ? 'bold' : 'normal',
          // 🐨 spread the incoming styles onto this inline style object
        },
        ...props,
      })}
    />
  )
}

const App = () => {
  const forceRerender = useForceRerender()
  const [inputValue, setInputValue] = React.useState('')

  const {data: items, run} = useAsync<Items>({data: [], status: 'pending'})
  React.useEffect(() => {
    const getItemsPromise = new Promise<Items>(resolve => {
      const items = getItems(inputValue)
      resolve(items)
    })

    run(getItemsPromise)
  }, [inputValue, run])

  // 🐨 create a listRef with React.useRef
  // which will be used for the parentRef option you pass to useVirtual
  // and should be applied to the <ul /> for our menu. This is how react-virtual
  // knows how to scroll our items as the user scrolls.

  // 🐨 call useVirtual with the following configuration options:
  // - size (the number of items)
  // - parentRef (the listRef you created above)
  // - estimateSize (a memoized callback function that returns the size for each item)
  //   💰 in our case, every item has the same size, so this will do: React.useCallback(() => 20, [])
  // - overscan (the number of additional rows to render outside the scrollable view)
  //   💰 You can play around with that number, but you probably don't need more than 10.
  // 🐨 you can set the return value of your useVirtual call to `rowVirtualizer`

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
    items: items ?? [],
    inputValue,
    onInputValueChange: ({inputValue: newValue}) =>
      setInputValue(String(newValue)),
    onSelectedItemChange: ({selectedItem}) =>
      alert(
        selectedItem
          ? `You selected ${selectedItem.name}`
          : 'Selection Cleared',
      ),
    itemToString: item => (item ? item.name : ''),
    // we want to override Downshift's scrollIntoView functionality because
    // react-virtual will handle scrolling for us:
    // 🐨 set scrollIntoView to a "no-op" function
    // 💰 scrollIntoView: () => {},
    // 🐨 when the highlightedIndex changes, then tell react-virtual to scroll
    // to that index.
    // 💰 onHighlightedIndexChange: ({highlightedIndex}) => highlightedIndex !== -1 && rowVirtualizer.scrollToIndex(highlightedIndex),
  })

  return (
    <div className="city-app">
      <button onClick={forceRerender}>force rerender</button>
      <div>
        <label {...getLabelProps()}>Find a city</label>
        <div {...getComboboxProps()}>
          <input {...getInputProps({type: 'text'})} />
          <button
            onClick={() => selectItem({} as UnpackArray<Items>)}
            aria-label="toggle menu"
          >
            &#10005;
          </button>
        </div>
        <Menu
          items={items ?? []}
          getMenuProps={getMenuProps}
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          selectedItem={selectedItem}
          // 🐨 pass the following props:
          // listRef: listRef
          // virtualRows: rowVirtualizer.virtualItems
          // totalHeight: rowVirtualizer.totalSize
        />
      </div>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/

// useMemo for expensive calculations
// 💯 React Production Mode
// http://localhost:3000/isolated/final/02.extra-1.js

// NOTE: there are no changes in this file from 02.js, for this one you're just
// observing the difference when you build for production

import * as React from 'react'
import {useCombobox} from '../use-combobox'
import {getItems} from '../filter-cities'
import {useForceRerender} from '../utils'
import {
  GetPropsCommonOptions,
  UseComboboxGetItemPropsOptions,
  UseComboboxGetMenuPropsOptions,
} from 'downshift'
import {UnpackArray} from '../types'

type Items = ReturnType<typeof getItems>

type IMenuProps = {
  items: Items
  getMenuProps: (
    options?: UseComboboxGetMenuPropsOptions | undefined,
    otherOptions?: GetPropsCommonOptions | undefined,
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

type IListItemProps = Pick<
  IMenuProps,
  'getItemProps' | 'selectedItem' | 'highlightedIndex'
> & {
  item: UnpackArray<Items>
  index: number
  children: React.ReactNode
}

const Menu = ({
  items,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
}: IMenuProps) => {
  return (
    <ul {...getMenuProps()}>
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          getItemProps={getItemProps}
          item={item}
          index={index}
          selectedItem={selectedItem}
          highlightedIndex={highlightedIndex}
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
  selectedItem,
  highlightedIndex,
  ...props
}: IListItemProps) => {
  const isSelected = selectedItem?.id === item.id
  const isHighlighted = highlightedIndex === index
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

const App = () => {
  const forceRerender = useForceRerender()
  const [inputValue, setInputValue] = React.useState('')

  const allItems = React.useMemo(() => getItems(inputValue), [inputValue])
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
    onInputValueChange: ({inputValue: newValue}) =>
      setInputValue(String(newValue)),
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
          <button
            onClick={() => selectItem({} as UnpackArray<Items>)}
            aria-label="toggle menu"
          >
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

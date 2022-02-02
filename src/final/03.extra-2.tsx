// React.memo for reducing unnecessary re-renders
// 💯 pass only primitive values
// http://localhost:3000/isolated/final/03.extra-2.js

import * as React from 'react'
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

type IListItemProps = Pick<IMenuProps, 'getItemProps'> & {
  item: UnpackArray<Items>
  index: number
  isSelected: boolean
  isHighlighted: boolean
  children: React.ReactNode
}

const Menu = React.memo(
  ({
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
            isSelected={selectedItem?.id === item.id}
            isHighlighted={highlightedIndex === index}
          >
            {item.name}
          </ListItem>
        ))}
      </ul>
    )
  },
)

const ListItem = React.memo(
  ({
    getItemProps,
    item,
    index,
    isHighlighted,
    isSelected,
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
          },
          ...props,
        })}
      />
    )
  },
)

const App = () => {
  const forceRerender = useForceRerender()
  const [inputValue, setInputValue] = React.useState('')

  const {data: allItems, run} = useAsync<Items>({data: [], status: 'pending'})
  React.useEffect(() => {
    const getItemsPromise = new Promise<Items>(resolve => {
      const items = getItems(inputValue)
      resolve(items)
    })

    run(getItemsPromise)
  }, [inputValue, run])
  const items = (allItems ?? []).slice(0, 100)

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

/*
eslint
  no-func-assign: 0,
*/

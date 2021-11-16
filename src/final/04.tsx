// Window large lists with react-virtual
// http://localhost:3000/isolated/final/04.js

import * as React from 'react'
import {useVirtual} from 'react-virtual'
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
  virtualRows: Array<{
    index: number
    size: number
    start: number
  }>
  totalHeight: number
  listRef: React.MutableRefObject<HTMLElement | null>
}

type IListItemProps = Pick<IMenuProps, 'getItemProps'> & {
  item: UnpackArray<Items>
  index: number
  isHighlighted: boolean
  isSelected: boolean
  style: React.CSSProperties
}

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

const Menu: React.FunctionComponent<IMenuProps> = ({
  items,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
  listRef,
  virtualRows,
  totalHeight,
}) => {
  return (
    <ul {...getMenuProps({ref: listRef})}>
      <li style={{height: totalHeight}} />
      {virtualRows.map(({index, size, start}) => {
        const item = items[index]
        if (!item) return null
        return (
          <ListItem
            key={item.id}
            getItemProps={getItemProps}
            item={item}
            index={index}
            isSelected={selectedItem?.id === item.id}
            isHighlighted={highlightedIndex === index}
            style={getVirtualRowStyles({size, start})}
          >
            {item.name}
          </ListItem>
        )
      })}
    </ul>
  )
}

const ListItem: React.FunctionComponent<IListItemProps> = ({
  getItemProps,
  item,
  index,
  isHighlighted,
  isSelected,
  style,
  ...props
}) => {
  return (
    <li
      {...getItemProps({
        index,
        item,
        style: {
          backgroundColor: isHighlighted ? 'lightgray' : 'inherit',
          fontWeight: isSelected ? 'bold' : 'normal',
          ...style,
        },
        ...props,
      })}
    />
  )
}

function App() {
  const forceRerender = useForceRerender()
  const [inputValue, setInputValue] = React.useState('')

  const {data, run} = useAsync<Items>({data: [], status: 'pending'})
  const items = data ?? []

  React.useEffect(() => {
    const getItemsPromise = new Promise<Items>(resolve => {
      const items = getItems(inputValue)
      resolve(items)
    })

    run(getItemsPromise)
  }, [inputValue, run])

  const listRef = React.useRef<HTMLElement | null>(null)

  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef: listRef,
    estimateSize: React.useCallback(() => 20, []),
    overscan: 10,
  })

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
    scrollIntoView: () => {},
    onHighlightedIndexChange: ({highlightedIndex}) =>
      highlightedIndex !== -1 &&
      rowVirtualizer.scrollToIndex(highlightedIndex ?? 0),
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
          listRef={listRef}
          virtualRows={rowVirtualizer.virtualItems}
          totalHeight={rowVirtualizer.totalSize}
        />
      </div>
    </div>
  )
}

export default App

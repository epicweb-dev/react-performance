// Window large lists with react-virtual
// http://localhost:3000/isolated/final/04.js

/** @jsx jsx */
import {jsx} from '@emotion/core'
import styled from '@emotion/styled'

import React from 'react'
import {useVirtual} from 'react-virtual'
import {useCombobox} from '../use-combobox'
import {getItems} from '../workerized-filter-cities'
import {useAsync} from '../utils'

const getVirtualRowStyles = ({size, start}) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: size,
  transform: `translateY(${start}px)`,
})

const onAttention = '&:hover, &:focus'

function Menu({
  items,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
  listRef,
  virtualRows,
  totalHeight,
  isOpen,
}) {
  return (
    <ul
      {...getMenuProps({
        ref: listRef,
        hidden: !isOpen,
        css: [
          {
            padding: 0,
            marginTop: 0,
            position: 'absolute',
            backgroundColor: 'white',
            width: '100%',
            maxHeight: '20rem',
            overflowY: 'auto',
            overflowX: 'hidden',
            outline: '0',
            transition: 'opacity .1s ease',
            borderRadius: '0 0 .28571429rem .28571429rem',
            boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
            borderColor: '#96c8da',
            borderTopWidth: '0',
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderLeftWidth: 1,
            borderStyle: 'solid',
            border: isOpen ? null : 'none',
          },
        ],
      })}
    >
      {isOpen ? (
        <>
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
        </>
      ) : null}
    </ul>
  )
}

function ListItem({
  getItemProps,
  item,
  index,
  isHighlighted,
  isSelected,
  style,
  ...props
}) {
  return (
    <li
      {...getItemProps({
        index,
        item,
        css: [
          {
            position: 'relative',
            cursor: 'pointer',
            display: 'block',
            border: 'none',
            textAlign: 'left',
            borderTop: 'none',
            lineHeight: '1em',
            color: 'rgba(0,0,0,.87)',
            fontSize: '1rem',
            textTransform: 'none',
            fontWeight: '400',
            boxShadow: 'none',
            padding: '8px 12px',
            whiteSpace: 'normal',
            wordWrap: 'normal',
          },
          isHighlighted
            ? {
                color: 'rgba(0,0,0,.95)',
                background: 'rgba(0,0,0,.03)',
              }
            : null,
          isSelected
            ? {
                color: 'rgba(0,0,0,.95)',
                fontWeight: '700',
              }
            : null,
        ],
        style,
        ...props,
      })}
    />
  )
}

function ArrowIcon({isOpen}) {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={16}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
      transform={isOpen ? 'rotate(180)' : undefined}
    >
      <path d="M1,6 L10,15 L19,6" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={12}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
    >
      <path d="M1,1 L19,19" />
      <path d="M19,1 L1,19" />
    </svg>
  )
}
const ControllerButton = styled('button')({
  backgroundColor: 'transparent',
  border: 'none',
  position: 'absolute',
  right: 0,
  top: 0,
  cursor: 'pointer',
  width: 47,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
})

function App() {
  const [inputValue, setInputValue] = React.useState('')

  const {data: items, run} = useAsync({data: [], status: 'pending'})
  React.useEffect(() => {
    run(getItems(inputValue))
  }, [inputValue, run])

  const listRef = React.useRef()

  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef: listRef,
    estimateSize: React.useCallback(() => 34, []),
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
    getToggleButtonProps,
    selectItem,
    isOpen,
  } = useCombobox({
    items,
    inputValue,
    onInputValueChange: ({inputValue: newValue}) => setInputValue(newValue),
    onSelectedItemChange: ({selectedItem}) =>
      alert(
        selectedItem
          ? `You selected ${selectedItem.name}`
          : 'Selection Cleared',
      ),
    itemToString: item => (item ? item.name : ''),
    scrollIntoView: () => {},
    onHighlightedIndexChange: ({highlightedIndex}) =>
      rowVirtualizer.scrollToIndex(highlightedIndex),
  })

  return (
    <div
      className="city-app"
      css={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '25vh',
      }}
    >
      <div>
        <label
          {...getLabelProps({
            css: {
              fontWeight: 'bold',
              display: 'block',
              marginBottom: 10,
            },
          })}
        >
          Find a city
        </label>
        <div {...getComboboxProps({css: {position: 'relative', width: 250}})}>
          <input
            {...getInputProps({
              type: 'text',
              css: [
                {
                  width: '100%', // full width - icon width/2 - border
                  fontSize: 14,
                  wordWrap: 'break-word',
                  lineHeight: '1em',
                  outline: 0,
                  whiteSpace: 'normal',
                  minHeight: '2em',
                  background: '#fff',
                  display: 'inline-block',
                  padding: '1em 2em 1em 1em',
                  color: 'rgba(0,0,0,.87)',
                  boxShadow: 'none',
                  border: '1px solid rgba(34,36,38,.15)',
                  borderRadius: '.30rem',
                  transition: 'box-shadow .1s ease,width .1s ease',
                  [onAttention]: {
                    borderColor: '#96c8da',
                    boxShadow: '0 2px 3px 0 rgba(34,36,38,.15)',
                  },
                },
                isOpen
                  ? {
                      borderBottomLeftRadius: '0',
                      borderBottomRightRadius: '0',
                      [onAttention]: {
                        boxShadow: 'none',
                      },
                    }
                  : null,
              ],
            })}
          />
          {selectedItem ? (
            <ControllerButton
              onClick={() => selectItem(null)}
              aria-label="clear selection"
            >
              <XIcon />
            </ControllerButton>
          ) : (
            <ControllerButton {...getToggleButtonProps()}>
              <ArrowIcon isOpen={isOpen} />
            </ControllerButton>
          )}
        </div>
        <Menu
          items={items}
          isOpen={isOpen}
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

function MainApp() {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
export default MainApp

// useMemo for expensive calculations
// 💯 Put getItems into a WebWorker

import React from 'react'
import Downshift from 'downshift'
import filterCitiesWorker from 'workerize!../filter-cities'
import {useAsync} from '../utils'

const {getItems} = filterCitiesWorker()

function Menu({
  getMenuProps,
  inputValue,
  getItemProps,
  highlightedIndex,
  selectedItem,
}) {
  const {data: items} = useAsync(
    React.useCallback(() => getItems(inputValue), [inputValue]),
  )
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
      {items
        ? items.slice(0, 100).map((item, index) => (
            <li
              {...getItemProps({
                key: item.id,
                index,
                item,
                style: {
                  backgroundColor:
                    highlightedIndex === index ? 'lightgray' : 'inherit',
                  fontWeight:
                    selectedItem && selectedItem.id === item.id
                      ? 'bold'
                      : 'normal',
                },
              })}
            >
              {item.name}
            </li>
          ))
        : null}
    </ul>
  )
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

////////////////////////////////////////////////////////////////////
//                                                                //
//                 Don't make changes below here.                 //
// But do look at it to see how your code is intended to be used. //
//                                                                //
////////////////////////////////////////////////////////////////////

function Usage() {
  return <FilterComponent />
}
Usage.title = 'useMemo for expensive calculations'

export default Usage

/*
eslint
  import/no-webpack-loader-syntax:0
*/

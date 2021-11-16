import {
  useCombobox as useDownshiftCombobox,
  UseComboboxStateChange,
} from 'downshift'

type IUseComboboxOptions<T> = {
  items: T[]
  inputValue: string
  onInputValueChange: (changes: UseComboboxStateChange<T>) => void
  onSelectedItemChange: (changes: UseComboboxStateChange<T>) => void
  itemToString: (item: T | null) => string
  scrollIntoView?: () => void
  onHighlightedIndexChange?: (changes: UseComboboxStateChange<T>) => void
}

const useCombobox = <T>(options: IUseComboboxOptions<T>) => {
  const {itemToString} = options

  return useDownshiftCombobox({
    stateReducer(state, {type, changes}) {
      // downshift's default is to select the highlighted item on blur
      // but we don't like that so we're using the state reducer to change
      // that default behavior
      // https://github.com/downshift-js/downshift/issues/1040
      if (type === useDownshiftCombobox.stateChangeTypes.InputBlur) {
        return {
          ...changes,
          highlightedIndex: -1,
          selectedItem: state.selectedItem,
          inputValue: itemToString(state.selectedItem),
        }
      }
      // changing the selection programmatically should also reset the
      // input value by default
      // https://github.com/downshift-js/downshift/issues/1049
      if (type === useDownshiftCombobox.stateChangeTypes.FunctionSelectItem) {
        return {
          ...changes,
          inputValue: '',
        }
      }
      return changes
    },
    ...options,
  })
}

export {useCombobox}

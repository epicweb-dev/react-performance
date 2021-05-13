import * as React from 'react'
import {alfredTip} from '@kentcdodds/react-workshop-app/test-utils'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../final/06'
// import App from '../exercise/06'

// sorry, I just couldn't find a reliable way to test your implementation
// so this test just ensures you don't break anything 😅

test('app continues to work', () => {
  render(<App />)
  alfredTip(() => {
    const dogNameInput = screen.getByRole('textbox', {name: /dog name/i})
    userEvent.type(dogNameInput, 'Gemma')
    expect(screen.getByText('Gemma')).toBeInTheDocument()
  }, `Unable to type a dog name and have it printed out.`)

  alfredTip(() => {
    const firstButton = document.body.querySelector('button.cell')
    const numberBefore = firstButton.textContent
    userEvent.click(firstButton)
    let numberAfter = firstButton.textContent
    if (numberAfter === numberBefore) {
      // it's possible that the randomization logic came up with the same number
      // but it's much less likely that would happen twice 😅
      userEvent.click(firstButton)
      numberAfter = firstButton.textContent
    }
    expect(numberAfter).not.toBe(numberBefore)
  }, `Unable to click the first cell to update its value.`)
})

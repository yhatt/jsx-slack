/** @jsx JSXSlack.h */
import { JSXSlack, createComponent } from '../src/v2/jsx'

const Blocks = createComponent(({ children }) =>
  JSXSlack.Children.toArray(children)
)

describe('JSXSlack v2', () => {
  it('does no longer need to wrap JSX in JSXSlack', () => {
    expect(<Blocks>hello</Blocks>).toStrictEqual(['hello'])
  })
})

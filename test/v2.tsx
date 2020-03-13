/** @jsx JSXSlack.h */
import { JSXSlack, createComponent } from '../src/v2/jsx'

const blockTypes = [
  'section',
  'context',
  'image',
  'divider',
  'actions',
  'file',
  'input',
] as const

const Section = createComponent(({ children }) => ({
  type: 'section',
  text: JSXSlack.Children.toArray(children).join(''),
}))

const Blocks = createComponent(({ children }) =>
  (
    JSXSlack.Children.map(children, (child: any): JSXSlack.Node | false => {
      let elm = child

      if (typeof elm === 'object') {
        // eslint-disable-next-line default-case
        switch (elm.$$jsxslack?.type) {
          case 'section':
            elm = JSXSlack.h(
              Section,
              elm.$$jsxslack.props,
              ...elm.$$jsxslack.children
            )
        }
      }

      if (typeof elm === 'object' && blockTypes.includes(elm.type)) return elm

      return false
    }) || []
  ).filter((child): child is JSXSlack.Node => !!child)
)

describe('JSXSlack v2', () => {
  it('does no longer need to wrap JSX in JSXSlack', () => {
    console.log(
      <Blocks>
        <Section>1</Section>
        <Section>2</Section>
        <Section>3</Section>
        <Section>4</Section>
      </Blocks>
    )
  })
})

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

  describe('Children helper', () => {
    describe('Children.flat', () => {
      it('returns flatten array', () => {
        const ObjComponent = createComponent(() => ({ foo: 'bar' }))

        // Array returned from component must not make flatten
        const ArrayComponent = createComponent(() => [1, 2, 3])

        // Functional component by user must return fragments to pass array
        const UserArrayComponent: JSXSlack.FC = () => (
          <JSXSlack.Fragment children={[4, 5, 6]} />
        )

        // But also can return array directly for React compatibility
        const ReactLikeComponent: any = () => [7, 8, 9]

        expect(
          JSXSlack.Children.flat(
            <JSXSlack.Fragment>
              a<JSXSlack.Fragment>b{'c'}</JSXSlack.Fragment>
              {false}
              {true && ['d', 'e']}
              {undefined}
              <JSXSlack.Fragment>
                {null}
                <ObjComponent />
                {0}
                <ArrayComponent />
              </JSXSlack.Fragment>
              <UserArrayComponent />
              <ReactLikeComponent />
            </JSXSlack.Fragment>
          )
        ).toHaveLength(14)
      })
    })
  })
})

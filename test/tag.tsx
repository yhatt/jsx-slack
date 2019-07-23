/** @jsx JSXSlack.h */
import JSXSlack, {
  jsxslack,
  Actions,
  Blocks,
  Button,
  Divider,
  Fragment,
  Image,
  Section,
} from '../src/index'

describe('Tagged template', () => {
  it('allows converting JSX to JSON without transpiler', () => {
    const count = 2
    const template = jsxslack`
      <Blocks>
        <Section>
          <Image src="https://example.com/example.jpg" alt="example" />
          <b>Tagged template</b><br />
          jsx-slack can use without transpiler by <code>jsxslack</code> tagged template!
        </Section>
        <Divider />
        <Actions>
          <Button actionId="clap">:clap: ${count}</Button>
        </Actions>
      </Blocks>
    `

    expect(template).toStrictEqual(
      JSXSlack(
        <Blocks>
          <Section>
            <Image src="https://example.com/example.jpg" alt="example" />
            <b>Tagged template</b>
            <br />
            jsx-slack can use without transpiler by <code>jsxslack</code> tagged
            template!
          </Section>
          <Divider />
          <Actions>
            <Button actionId="clap">:clap: {count}</Button>
          </Actions>
        </Blocks>
      )
    )
  })

  describe('jsxslack.fragment', () => {
    it('returns raw nodes for reusable as component', () => {
      const func = title => jsxslack.fragment`
        <Section><b>${title}</b></Section>
        <Divider />
      `

      expect(func('test')).toStrictEqual(
        <Fragment>
          <Section>
            <b>test</b>
          </Section>
          <Divider />
        </Fragment>
      )

      const Component = ({ children }) => jsxslack.fragment`
        <Section><b>${children}</b></Section>
        <Divider />
      `

      expect(jsxslack`<Blocks><${Component}>Hello<//></Blocks>`).toStrictEqual(
        JSXSlack(
          <Blocks>
            <Section>
              <b>Hello</b>
            </Section>
            <Divider />
          </Blocks>
        )
      )

      expect(jsxslack.fragment`<${Component}>test<//>`).toStrictEqual(
        func('test')
      )
    })
  })
})

/** @jsx JSXSlack.h */
import JSXSlack, {
  jsxslack,
  Actions,
  Block,
  Button,
  Divider,
  Image,
  Section,
} from '../src/index'

describe('Tagged template', () => {
  it('allows converting JSX to JSON without transpiler', () => {
    const count = 2
    const template = jsxslack`
      <Block>
        <Section>
          <Image src="https://example.com/example.jpg" alt="example" />
          <b>Tagged template</b><br />
          jsx-slack can use without transpiler by <code>jsxslack</code> tagged template!
        </Section>
        <Divider />
        <Actions>
          <Button actionId="clap">:clap: ${count}</Button>
        </Actions>
      </Block>
    `

    expect(template).toStrictEqual(
      JSXSlack(
        <Block>
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
        </Block>
      )
    )
  })
})

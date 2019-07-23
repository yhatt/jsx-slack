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

  it('has same decode behavior compatible with JSX for HTML entities', () => {
    const [jsxEntitySection] = JSXSlack(
      <Blocks>
        <Section>
          <code>
            &lt;span data-test=&quot;&amp;&quot;&gt;&hearts;&lt;/span&gt;
          </code>
        </Section>
      </Blocks>
    )

    expect(jsxEntitySection.text.text).toBe(
      '`<span data-test="&">\u2665</span>`'
    )

    const [jsxRawEntitySection] = JSXSlack(
      <Blocks>
        <Section>
          <code>
            {'&lt;span data-test=&quot;&amp;&quot;&gt;&hearts;&lt;/span&gt;'}
          </code>
        </Section>
      </Blocks>
    )

    // Slack requires double-escapation to ampersand for holding raw string of "&lt;", "&gt;", and "&amp;".
    expect(jsxRawEntitySection.text.text).toBe(
      '`&amp;lt;span data-test=&quot;&amp;amp;&quot;&amp;gt;&hearts;&amp;lt;/span&amp;gt;`'
    )

    const [templateEntitySection] = jsxslack`
      <Blocks>
        <Section>
          <code>
            &lt;span data-test=&quot;&amp;&quot;&gt;&hearts;&lt;/span&gt;
          </code>
        </Section>
      </Blocks>
    `

    expect(templateEntitySection).toStrictEqual(jsxEntitySection)

    const [templateRawEntitySection] = jsxslack`
      <Blocks>
        <Section>
          <code>
            ${'&lt;span data-test=&quot;&amp;&quot;&gt;&hearts;&lt;/span&gt;'}
          </code>
        </Section>
      </Blocks>
    `

    expect(templateRawEntitySection).toStrictEqual(jsxRawEntitySection)
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

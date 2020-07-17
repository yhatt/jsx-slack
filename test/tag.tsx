/** @jsx JSXSlack.h */
import {
  Actions,
  Blocks,
  Button,
  Divider,
  Image,
  JSXSlack,
  Option,
  Section,
  Select,
  jsxslack,
} from '../src/index'

describe('Tagged template', () => {
  it('allows converting Block Kit JSX to JSON without transpiler', () => {
    const count = 2
    const template = jsxslack`
      <Blocks>
        <!-- jsx-slack template literal tag can use as like as JSX. -->
        <Section>
          <Image src="https://example.com/example.jpg" alt="example" />
          <b>Tagged template</b><br />
          jsx-slack can use without transpiler by <code>jsxslack</code> tagged template!
        </Section>
        <Divider />
        <Actions>
          <Button actionId="clap${count}">:clap: ${count}</Button>
          <Select actionId="select">
            <Option value="1">one</Option>
            <Option value="2">two</Option>
            <Option value="3">three</Option>
          </Select>
        </Actions>
      </Blocks>
    `

    expect(template).toStrictEqual(
      JSXSlack(
        <Blocks>
          {/* jsx-slack template literal tag can use as like as JSX. */}
          <Section>
            <Image src="https://example.com/example.jpg" alt="example" />
            <b>Tagged template</b>
            <br />
            jsx-slack can use without transpiler by <code>jsxslack</code> tagged
            template!
          </Section>
          <Divider />
          <Actions>
            <Button actionId={`clap${count}`}>:clap: {count}</Button>
            <Select actionId="select">
              <Option value="1">one</Option>
              <Option value="2">two</Option>
              <Option value="3">three</Option>
            </Select>
          </Actions>
        </Blocks>
      )
    )
  })

  it('can use fragmented options in <Select>', () => {
    const template = jsxslack`
      <Blocks>
        <Actions>
          <Select>
            ${[...Array(10)].map(
              (_, i) => jsxslack`<Option value=${i.toString()}>${i}</Option>`
            )}
          </Select>
        </Actions>
      </Blocks>
    `

    expect(template).toStrictEqual(
      JSXSlack(
        <Blocks>
          <Actions>
            <Select>
              {[...Array(10)].map((_, i) => (
                <Option value={i.toString()}>{i}</Option>
              ))}
            </Select>
          </Actions>
        </Blocks>
      )
    )
  })

  it('can use interpolations through conditional rendering', () => {
    const template = jsxslack`
      <Blocks>
        <Section>cond${'i'}tio${null}nal</Section>
        ${true && jsxslack`<section>rendering</section>`}
        ${false && jsxslack`<section>test</section>`}
      </Blocks>
    `

    expect(template).toStrictEqual(
      JSXSlack(
        <Blocks>
          <Section>conditional</Section>
          <Section>rendering</Section>
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
      '`&lt;span data-test="&amp;"&gt;\u2665&lt;/span&gt;`'
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
      '`&amp;lt;span data-test=&amp;quot;&amp;amp;&amp;quot;&amp;gt;&amp;hearts;&amp;lt;/span&amp;gt;`'
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

  describe('[DEPRECATED] jsxslack.raw', () => {
    it('redirects to invoke into jsxslack', () => {
      const text = 'hello'
      const raw = jsxslack.raw`<Section>${text}<//>`

      expect(raw).toStrictEqual(<Section>{text}</Section>)
      expect(raw).toStrictEqual(jsxslack`<Section>${text}<//>`)
    })
  })
})

/** @jsx JSXSlack.h */
import {
  Dialog,
  Input,
  Option as DialogOption,
  Select as DialogSelect,
  Textarea,
  UsersSelect,
} from '../src/dialog'
import JSXSlack, {
  Actions,
  Blocks,
  Button,
  Divider,
  Fragment,
  Image,
  jsxslack,
  Option as BlockKitOption,
  Section,
  Select as BlockKitSelect,
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
            <BlockKitSelect actionId="select">
              <BlockKitOption value="1">one</BlockKitOption>
              <BlockKitOption value="2">two</BlockKitOption>
              <BlockKitOption value="3">three</BlockKitOption>
            </BlockKitSelect>
          </Actions>
        </Blocks>
      )
    )
  })

  it('allows converting dialog JSX to JSON without transpiler', () => {
    const template = jsxslack`
      <Dialog callbackId="callback" title="test">
        <Input type="hidden" name="hiddenState" value=${['a', 'b', 'c']} />
        <Input type="text" name="foo" label="foo" required />
        <Textarea name="bar" label="bar" />
        <Select name="select" label="select">
          <Option value="1">one</Option>
          <Option value="2">two</Option>
          <Option value="3">three</Option>
        </Select>
        <Input type="submit" value="Submit dialog" />
      </Dialog>
    `

    expect(template).toStrictEqual(
      JSXSlack(
        <Dialog callbackId="callback" title="test">
          <Input type="hidden" name="hiddenState" value={['a', 'b', 'c']} />
          <Input type="text" name="foo" label="foo" required />
          <Textarea name="bar" label="bar" />
          <DialogSelect name="select" label="select">
            <DialogOption value="1">one</DialogOption>
            <DialogOption value="2">two</DialogOption>
            <DialogOption value="3">three</DialogOption>
          </DialogSelect>
          <Input type="submit" value="Submit dialog" />
        </Dialog>
      )
    )
  })

  it('can use imported components through interpolation', () => {
    expect(jsxslack`
      <${Dialog} callbackId="callback" title="test">
        <${Input} type="hidden" name="hiddenState" value=${['a', 'b', 'c']} />
        <${Input} type="text" name="foo" label="foo" required />
        <${Textarea} name="bar" label="bar" />
        <${DialogSelect} name="select" label="select">
          <${DialogOption} value="1">one<//>
          <${DialogOption} value="2">two<//>
          <${DialogOption} value="3">three<//>
        <//>
        <${Input} type="submit" value="Submit dialog" />
      <//>
    `).toMatchSnapshot()
  })

  it('can use fragmented options in <Select>', () => {
    const template = jsxslack`
      <Blocks>
        <Actions>
          <Select>
            ${[...Array(10)].map(
              (_, i) =>
                jsxslack.fragment`<Option value=${i.toString()}>${i}</Option>`
            )}
          </Select>
        </Actions>
      </Blocks>
    `

    expect(template).toStrictEqual(
      JSXSlack(
        <Blocks>
          <Actions>
            <BlockKitSelect>
              {[...Array(10)].map((_, i) => (
                <BlockKitOption value={i.toString()}>{i}</BlockKitOption>
              ))}
            </BlockKitSelect>
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

    it('allows using "Dialog." prefix to use select components for dialog', () => {
      const Component = ({ value }) => jsxslack.fragment`
        <Dialog.UsersSelect name="first-user" label="First user" initialUser=${value} />
        <Dialog.UsersSelect name="second-user" label="Second user" initialUser=${value} />
      `

      expect(
        jsxslack`<Dialog callbackId="dialog" title="Dialog"><${Component} value="U01234567" /></Dialog>`
      ).toStrictEqual(
        JSXSlack(
          <Dialog callbackId="dialog" title="Dialog">
            <UsersSelect
              name="first-user"
              label="First user"
              initialUser="U01234567"
            />
            <UsersSelect
              name="second-user"
              label="Second user"
              initialUser="U01234567"
            />
          </Dialog>
        )
      )
    })
  })
})

/** @jsx JSXSlack.h */
import { Dialog, Input, Option, Select, Textarea } from '../src/dialog'
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
          <Select name="select" label="select">
            <Option value="1">one</Option>
            <Option value="2">two</Option>
            <Option value="3">three</Option>
          </Select>
          <Input type="submit" value="Submit dialog" />
        </Dialog>
      )
    )
  })

  it('can use imported dialog components through interpolation', () => {
    expect(jsxslack`
      <${Dialog} callbackId="callback" title="test">
        <${Input} type="hidden" name="hiddenState" value=${['a', 'b', 'c']} />
        <${Input} type="text" name="foo" label="foo" required />
        <${Textarea} name="bar" label="bar" />
        <${Select} name="select" label="select">
          <${Option} value="1">one<//>
          <${Option} value="2">two<//>
          <${Option} value="3">three<//>
        <//>
        <${Input} type="submit" value="Submit dialog" />
      <//>
    `).toMatchSnapshot()
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

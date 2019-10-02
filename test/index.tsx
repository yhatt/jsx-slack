/** @jsx JSXSlack.h */
import JSXSlack, { Option, SelectFragment } from '../src/index'
import { jsxOnParsed } from '../src/jsx'

beforeEach(() => JSXSlack.exactMode(false))

describe('#JSXSlack', () => {
  it('executes specified func after parsing if passed internal node has jsxOnParsed symbol prop', () => {
    const onParsed = jest.fn()
    const node = (
      <SelectFragment>
        <Option value="a">A</Option>
      </SelectFragment>
    )

    node.props[jsxOnParsed] = onParsed
    JSXSlack(node)

    expect(onParsed).toBeCalledTimes(1)
  })

  it('throws error by passed invalid node', () =>
    expect(() => JSXSlack({ props: {}, type: -1 } as any)).toThrow())
})

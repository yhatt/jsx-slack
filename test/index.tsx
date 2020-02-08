/** @jsx JSXSlack.h */
import JSXSlack from '../src/index'

beforeEach(() => JSXSlack.exactMode(false))

describe('#JSXSlack', () => {
  it('throws error by passed invalid node', () =>
    expect(() => JSXSlack({ props: {}, type: -1, children: [] })).toThrow())

  it('throws error when using not supported HTML element in JSX', () =>
    expect(() =>
      JSXSlack({ props: {}, type: 'center', children: [] })
    ).toThrow())
})

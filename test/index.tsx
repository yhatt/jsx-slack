/** @jsx JSXSlack.h */
import JSXSlack from '../src/index'

beforeEach(() => JSXSlack.exactMode(false))

describe('#JSXSlack', () => {
  it('throws error by passed invalid node', () =>
    expect(() => JSXSlack({ props: {}, type: -1 } as any)).toThrow())
})

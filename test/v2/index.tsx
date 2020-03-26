/** @jsx JSXSlack.h */
import JSXSlack, { Blocks, Home, Divider } from '../../src/v2/index'

describe('jsx-slack builtin components', () => {
  it('works', () => {
    expect(() => [
      <Blocks>
        <Divider blockId="hoge" />
      </Blocks>,
      <Home>
        <Divider id="hoge" />
      </Home>,
      <Home>
        <hr id="test" />
      </Home>,
    ]).not.toThrow()
  })
})

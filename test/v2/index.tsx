/** @jsx JSXSlack.h */
import { JSXSlack, Blocks, Divider, Home, Image } from '../../src/v2/index'

describe('jsx-slack builtin components', () => {
  it('works', () => {
    expect(() => [
      <Blocks>
        <Image src="https://example.com/test.jpg" alt="example" title="title" />
        <Divider blockId="hoge" />
      </Blocks>,
      <Home>
        <Image src="https://example.com/test.jpg" alt="example" title="title" />
        <Divider id="hoge" />
      </Home>,
      <Home>
        <img src="https://example.com/test.jpg" alt="example" title="title" />
        <hr id="test" />
      </Home>,
    ]).not.toThrow()
  })
})

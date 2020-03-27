/** @jsx JSXSlack.h */
import {
  JSXSlack,
  Blocks,
  Context,
  Divider,
  File,
  Home,
  Image,
  Section,
} from '../src/index'

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
      <Blocks>
        <Section>Hello</Section>
        <Context>Hello</Context>
      </Blocks>,
    ]).not.toThrow()

    expect(() => [
      <Home>
        <File externalId="test" />
      </Home>,
    ]).toThrow()
  })
})

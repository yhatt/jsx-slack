/** @jsx JSXSlack.h */
/** @jsxFrag JSXSlack.Fragment */
import { JSXSlack } from '../src/index'
import { richText } from '../src/rich-text'

describe('Rich text', () => {
  it('Test', () => {
    richText('Hello, world!')
    // richText(
    //   <>
    //     <p>jsx-slack</p>
    //     <p>
    //       Hello,
    //       <br />
    //       World!
    //     </p>
    //   </>,
    // )
  })

  it('Slack example', () => {
    richText(
      <>
        Check out these different block types with paragraph breaks between
        them:
        <pre>
          Hello there, I am preformatted block! I can have multiple paragraph
          breaks within the block.
        </pre>
        <p>
          I am rich text with a paragraph break following preformatted text.
        </p>
        <p>I can have multiple paragraph breaks within the block.</p>
        <blockquote>
          <p>I am a basic rich text quote,</p>
          <p>I can have multiple paragraph breaks within the block.</p>
        </blockquote>
        <p>I am rich text with a paragraph after the quote block</p>
        <blockquote>I am a basic quote block following rich text</blockquote>
        <pre>I am more preformatted text following a quote block</pre>
        <blockquote>
          I am a basic quote block following preformatted text
        </blockquote>
        <ul>
          <li>list item one</li>
          <li>list item two</li>
        </ul>
        <p>I am rich text with a paragraph break after a list</p>
      </>,
    )
  })
})

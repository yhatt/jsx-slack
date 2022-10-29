/** @jsxRuntime classic */
/** @jsx JSXSlack.h */
/** @jsxFrag JSXSlack.Fragment */
import { JSXSlackError } from '../../src/error'
import { JSXSlack, Blocks, Fragment, Section } from '../../src/index'

describe('Babel transpilation through classic runtime', () => {
  it('accepts JSX', () => {
    expect(
      <Blocks>
        <Section>
          <p>Hello, world!</p>
        </Section>
      </Blocks>
    ).toMatchInlineSnapshot(`
      [
        {
          "text": {
            "text": "Hello, world!",
            "type": "mrkdwn",
            "verbatim": true,
          },
          "type": "section",
        },
      ]
    `)
  })

  it('accepts fragment syntax', () => {
    const fragment = (
      <>
        <Section>Section A</Section>
        <Section>Section B</Section>
        <Section>Section C</Section>
      </>
    )

    const Component = () => fragment

    expect(
      <Blocks>
        <Component />
      </Blocks>
    ).toMatchInlineSnapshot(`
      [
        {
          "text": {
            "text": "Section A",
            "type": "mrkdwn",
            "verbatim": true,
          },
          "type": "section",
        },
        {
          "text": {
            "text": "Section B",
            "type": "mrkdwn",
            "verbatim": true,
          },
          "type": "section",
        },
        {
          "text": {
            "text": "Section C",
            "type": "mrkdwn",
            "verbatim": true,
          },
          "type": "section",
        },
      ]
    `)

    expect(fragment.$$jsxslack.type).toBe(Fragment)
  })

  describe('Development mode specific', () => {
    it('has __source prop for development', () => {
      const Component = ({ __source }) => __source

      expect(<Component />).toStrictEqual(
        expect.objectContaining({
          columnNumber: expect.any(Number),
          fileName: expect.any(String),
          lineNumber: expect.any(Number),
        })
      )
    })

    it('throws JSXSlackError with clean stack pointed out the location of JSX', () => {
      expect.assertions(2)

      try {
        const invalid = (
          <Section>
            <div>invalid</div>
          </Section>
        )
      } catch (e) {
        expect(e).toBeInstanceOf(JSXSlackError)
        expect(e.stack).toContain(__dirname)
      }
    })
  })
})

/** @jsxImportSource @speee-js/jsx-slack */
import { Blocks, Fragment, Section } from '../../src/index'

jest.mock('../../jsx-dev-runtime')

it('accepts JSX', () => {
  expect(
    <Blocks>
      <Section>
        <p>Hello, world!</p>
      </Section>
    </Blocks>
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "text": Object {
          "text": "Hello, world!",
          "type": "mrkdwn",
          "verbatim": true,
        },
        "type": "section",
      },
    ]
  `)
})

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
    Array [
      Object {
        "text": Object {
          "text": "Section A",
          "type": "mrkdwn",
          "verbatim": true,
        },
        "type": "section",
      },
      Object {
        "text": Object {
          "text": "Section B",
          "type": "mrkdwn",
          "verbatim": true,
        },
        "type": "section",
      },
      Object {
        "text": Object {
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

it('merges key prop to props', () => {
  const Component = ({ key }) => key
  expect(<Component key="abc" />).toBe('abc')
})

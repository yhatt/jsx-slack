import { jsxslack } from 'jsx-slack'

describe('ES modules', () => {
  describe('jsxslack template literal tag', () => {
    it('renders JSON object without using JSX transpiler', () => {
      expect(jsxslack`
        <Blocks>
          <Section>
            ES modules
          </Section>
        </Blocks>
      `).toMatchInlineSnapshot(`
Array [
  Object {
    "text": Object {
      "text": "ES modules",
      "type": "mrkdwn",
      "verbatim": true,
    },
    "type": "section",
  },
]
`)
    })
  })
})

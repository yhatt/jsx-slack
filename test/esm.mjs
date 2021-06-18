/* eslint-disable import/no-unresolved */
import { jsxslack } from 'jsx-slack'
import * as jsxDevRuntime from 'jsx-slack/jsx-dev-runtime'
import * as jsxRuntime from 'jsx-slack/jsx-runtime'

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

  describe('JSX runtime', () => {
    it('has jsx function and jsxs function', () => {
      expect(jsxRuntime).toHaveProperty('jsx', expect.any(Function))
      expect(jsxRuntime).toHaveProperty('jsxs', expect.any(Function))
    })
  })

  describe('JSX dev runtime', () => {
    it('has jsxDEV function', () => {
      expect(jsxDevRuntime).toHaveProperty('jsxDEV', expect.any(Function))
    })
  })
})

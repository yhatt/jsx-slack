/* eslint-disable import/no-unresolved */
import { jsxslack, Fragment } from 'jsx-slack'
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
        [
          {
            "text": {
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

    it('has exported Fragment', () => {
      expect(jsxRuntime).toHaveProperty('Fragment')
      expect(jsxRuntime.Fragment({ children: ['A', 'B'] })).toStrictEqual(
        Fragment({ children: ['A', 'B'] }),
      )
    })
  })

  describe('JSX dev runtime', () => {
    it('has jsxDEV function', () => {
      expect(jsxDevRuntime).toHaveProperty('jsxDEV', expect.any(Function))
    })

    it('has exported Fragment', () => {
      expect(jsxDevRuntime).toHaveProperty('Fragment')
      expect(jsxDevRuntime.Fragment({ children: ['A', 'B'] })).toStrictEqual(
        Fragment({ children: ['A', 'B'] }),
      )
    })
  })
})

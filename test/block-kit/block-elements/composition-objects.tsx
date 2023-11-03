/** @jsx JSXSlack.h */
import {
  Actions,
  Blocks,
  Button,
  Confirm,
  Image,
  JSXSlack,
  Mrkdwn,
  Section,
  Context,
  Field,
} from '../../../src/index'

beforeEach(() => JSXSlack.exactMode(false))

describe('Composition objects', () => {
  describe('<Confirm>', () => {
    it('returns the actual composition object', () =>
      expect(<Confirm>Confirm</Confirm>).toStrictEqual({
        text: <Mrkdwn verbatim>Confirm</Mrkdwn>,
      }))

    it('outputs action included <Confirm> object', () =>
      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <Button
                confirm={
                  <Confirm>
                    <b>Are you sure?</b> Message will be share.
                  </Confirm>
                }
              >
                Share
              </Button>
            </Actions>
          </Blocks>,
        ),
      ).toMatchInlineSnapshot(`
        [
          {
            "block_id": "actions",
            "elements": [
              {
                "confirm": {
                  "text": {
                    "text": "*Are you sure?* Message will be share.",
                    "type": "mrkdwn",
                    "verbatim": true,
                  },
                },
                "text": {
                  "emoji": true,
                  "text": "Share",
                  "type": "plain_text",
                },
                "type": "button",
              },
            ],
            "type": "actions",
          },
        ]
      `))

    it('outputs action included <Confirm> object with a <Mrkdwn> child', () =>
      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <Button
                confirm={
                  <Confirm
                    title="Share to SNS"
                    confirm="Yes, please"
                    deny="Cancel"
                    style="primary"
                  >
                    <Mrkdwn verbatim={false}>
                      <b>Are you sure?</b> Message will be share.
                    </Mrkdwn>
                  </Confirm>
                }
              >
                Share
              </Button>
            </Actions>
          </Blocks>,
        ),
      ).toMatchInlineSnapshot(`
        [
          {
            "block_id": "actions",
            "elements": [
              {
                "confirm": {
                  "confirm": {
                    "emoji": true,
                    "text": "Yes, please",
                    "type": "plain_text",
                  },
                  "deny": {
                    "emoji": true,
                    "text": "Cancel",
                    "type": "plain_text",
                  },
                  "style": "primary",
                  "text": {
                    "text": "*Are you sure?* Message will be share.",
                    "type": "mrkdwn",
                    "verbatim": false,
                  },
                  "title": {
                    "emoji": true,
                    "text": "Share to SNS",
                    "type": "plain_text",
                  },
                },
                "text": {
                  "emoji": true,
                  "text": "Share",
                  "type": "plain_text",
                },
                "type": "button",
              },
            ],
            "type": "actions",
          },
        ]
      `))
  })

  describe('<Mrkdwn>', () => {
    it('outputs a <Section> block with a <Mrkdwn> component and preserves the verbatim prop', () => {
      expect(
        JSXSlack(
          <Blocks>
            <Section>
              <Mrkdwn verbatim={false}>Hello!</Mrkdwn>
            </Section>
          </Blocks>,
        ),
      ).toStrictEqual([
        {
          type: 'section',
          text: { type: 'mrkdwn', text: 'Hello!', verbatim: false },
        },
      ])

      expect(
        JSXSlack(
          <Blocks>
            <Section>
              <Field>
                <Mrkdwn verbatim={false}>Hello!</Mrkdwn>
              </Field>
            </Section>
          </Blocks>,
        ),
      ).toStrictEqual([
        {
          type: 'section',
          fields: [{ type: 'mrkdwn', text: 'Hello!', verbatim: false }],
        },
      ])
    })

    it('outputs a <Context> block with an image and multiple mrkdwn elements', () =>
      expect(
        JSXSlack(
          <Blocks>
            <Context>
              <Image src="https://example.com/test.jpg" alt="Test Image" />
              Supporting <code>context</code> block would be hard!
              <Mrkdwn verbatim={false}>
                <i>@here</i>
              </Mrkdwn>
              :dizzy_face:
            </Context>
          </Blocks>,
        ),
      ).toStrictEqual([
        {
          type: 'context',
          elements: [
            {
              type: 'image',
              image_url: 'https://example.com/test.jpg',
              alt_text: 'Test Image',
            },
            {
              type: 'mrkdwn',
              text: 'Supporting `context` block would be hard!',
              verbatim: true,
            },
            {
              type: 'mrkdwn',
              text: '_@here_',
              verbatim: false,
            },
            {
              type: 'mrkdwn',
              text: ':dizzy_face:',
              verbatim: true,
            },
          ],
        },
      ]))

    it('converts <Mrkdwn> elements into mrkdwn elements and preserves the verbatim prop', () =>
      expect(
        JSXSlack(
          <Blocks>
            <Context>
              <Mrkdwn verbatim={false}>Hello</Mrkdwn>
              World
            </Context>
          </Blocks>,
        ),
      ).toStrictEqual([
        {
          type: 'context',
          elements: [
            { type: 'mrkdwn', text: 'Hello', verbatim: false },
            { type: 'mrkdwn', text: 'World', verbatim: true },
          ],
        },
      ]))

    it('bypasses HTML-like formatting and auto escape if enabled raw prop', () => {
      expect(
        <Mrkdwn raw>{'<!here> test raw string & disabled auto escape'}</Mrkdwn>,
      ).toStrictEqual({
        type: 'mrkdwn',
        text: '<!here> test raw string & disabled auto escape',
      })

      expect(
        <Mrkdwn raw>
          ignores <b>bold</b>, <i>italic</i>, and <s>strikethrough</s>
        </Mrkdwn>,
      ).toStrictEqual({
        type: 'mrkdwn',
        text: 'ignores bold, italic, and strikethrough',
      })

      expect(
        <Mrkdwn raw verbatim>
          raw &amp; verbatim
        </Mrkdwn>,
      ).toStrictEqual({
        type: 'mrkdwn',
        text: 'raw & verbatim', // &amp; is required to render "&" in JSX
        verbatim: true,
      })
    })
  })
})

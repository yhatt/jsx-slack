/** @jsx JSXSlack.h */
import JSXSlack, {
  Actions,
  Blocks,
  Button,
  Confirm,
  Image,
  Mrkdwn,
  Section,
  Context,
  Field,
} from '../../../src/index'

beforeEach(() => JSXSlack.exactMode(false))

describe('Composition objects', () => {
  describe('<Confirm>', () => {
    it('outputs action included <Confirm> object', () =>
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
                  >
                    <b>Are you sure?</b> Message will be share.
                  </Confirm>
                }
              >
                Share
              </Button>
            </Actions>
          </Blocks>
        )
      ).toMatchInlineSnapshot(`
        Array [
          Object {
            "block_id": "actions",
            "elements": Array [
              Object {
                "confirm": Object {
                  "confirm": Object {
                    "emoji": true,
                    "text": "Yes, please",
                    "type": "plain_text",
                  },
                  "deny": Object {
                    "emoji": true,
                    "text": "Cancel",
                    "type": "plain_text",
                  },
                  "text": Object {
                    "text": "*Are you sure?* Message will be share.",
                    "type": "mrkdwn",
                    "verbatim": true,
                  },
                  "title": Object {
                    "emoji": true,
                    "text": "Share to SNS",
                    "type": "plain_text",
                  },
                },
                "text": Object {
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

    it('outputs action included <Confirm> object with a <Mrkdwn> child', () => {
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
                  >
                    <Mrkdwn verbatim={false}>submit @user</Mrkdwn>
                  </Confirm>
                }
              >
                Share
              </Button>
            </Actions>
          </Blocks>
        )
      ).toEqual([
        {
          block_id: 'actions',
          elements: [
            {
              confirm: {
                confirm: {
                  emoji: true,
                  text: 'Yes, please',
                  type: 'plain_text',
                },
                deny: {
                  emoji: true,
                  text: 'Cancel',
                  type: 'plain_text',
                },
                text: {
                  text: 'submit @user',
                  type: 'mrkdwn',
                  verbatim: false,
                },
                title: {
                  emoji: true,
                  text: 'Share to SNS',
                  type: 'plain_text',
                },
              },
              text: {
                emoji: true,
                text: 'Share',
                type: 'plain_text',
              },
              type: 'button',
            },
          ],
          type: 'actions',
        },
      ])
    })
  })

  describe('<Mrkdwn>', () => {
    it('outputs a <Section> block with a <Mrkdwn> component and preserves the verbatim prop', () => {
      expect(
        JSXSlack(
          <Blocks>
            <Section>
              <Mrkdwn verbatim={false}>Hello!</Mrkdwn>
            </Section>
          </Blocks>
        )
      ).toEqual([
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
          </Blocks>
        )
      ).toEqual([
        {
          type: 'section',
          fields: [{ type: 'mrkdwn', text: 'Hello!', verbatim: false }],
        },
      ])
    })

    it('outputs a <Context> block with an image and multiple mrkdwn elements', () => {
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
          </Blocks>
        )
      ).toEqual([
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
      ])
    })

    it('converts <Mrkdwn> elements into mrkdwn elements and preserves the verbatim prop', () =>
      expect(
        JSXSlack(
          <Blocks>
            <Context>
              <Mrkdwn verbatim={false}>Hello</Mrkdwn>
              World
            </Context>
          </Blocks>
        )
      ).toEqual([
        {
          type: 'context',
          elements: [
            { type: 'mrkdwn', text: 'Hello', verbatim: false },
            { type: 'mrkdwn', text: 'World', verbatim: true },
          ],
        },
      ]))
  })
})

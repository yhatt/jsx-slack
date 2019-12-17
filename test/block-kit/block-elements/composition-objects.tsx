/** @jsx JSXSlack.h */
import JSXSlack, {
  Actions,
  Blocks,
  Button,
  Confirm,
  MrkDwn,
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
    it('<Confirm> object with a <MrkDwn> child throws error', () => {
      expect(() =>
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
                    <MrkDwn verbatim={false}>
                      Are you sure? Message will be share.
                    </MrkDwn>
                  </Confirm>
                }
              >
                Share
              </Button>
            </Actions>
          </Blocks>
        )
      ).toThrow()
    })
  })
})

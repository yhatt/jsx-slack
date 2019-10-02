/** @jsx JSXSlack.h */
import { View } from '@slack/types'
import JSXSlack, {
  Blocks,
  Escape,
  Input,
  Modal,
  Option,
  Section,
  Select,
} from '../../src/index'

beforeEach(() => JSXSlack.exactMode(false))

describe('Container components', () => {
  describe('<Blocks>', () => {
    it('throws error when <Blocks> has unexpected element', () => {
      expect(() =>
        JSXSlack(
          <Blocks>
            <b>unexpected</b>
          </Blocks>
        )
      ).toThrow()

      expect(() =>
        JSXSlack(
          <Blocks>
            <Escape>unexpected</Escape>
          </Blocks>
        )
      ).toThrow()

      // <Input> block cannot use in message
      expect(() =>
        JSXSlack(
          <Blocks>
            <Input label="Select">
              <Select>
                <Option value="test">test</Option>
              </Select>
            </Input>
          </Blocks>
        )
      ).toThrow()
    })
  })

  describe('<Modal>', () => {
    it('generates view payload JSON', () => {
      const simpleView: View = {
        type: 'modal',
        title: { type: 'plain_text', text: 'test', emoji: true },
        blocks: [{ type: 'section', text: expect.any(Object) }],
      }

      expect(
        JSXSlack(
          <Modal title="test">
            <Section>Hello!</Section>
          </Modal>
        )
      ).toStrictEqual(simpleView)

      // Optional attributes
      const viewWithOptions: View & Record<string, any> = {
        type: 'modal',
        title: expect.any(Object),
        blocks: expect.any(Array),
        submit: { type: 'plain_text', text: 'Submit', emoji: true },
        close: { type: 'plain_text', text: 'Close', emoji: true },
        private_metadata: 'private_metadata',
        clear_on_close: true,
        notify_on_close: false,

        // Fields for API
        callback_id: 'callback_id',
        external_id: 'external_id',
      }

      expect(
        JSXSlack(
          <Modal
            callbackId="callback_id"
            clearOnClose
            close="Close"
            externalId="external_id"
            notifyOnClose={false}
            privateMetadata="private_metadata"
            submit="Submit"
            title="test"
          >
            <Section>Hello!</Section>
          </Modal>
        )
      ).toStrictEqual(viewWithOptions)
    })
  })
})

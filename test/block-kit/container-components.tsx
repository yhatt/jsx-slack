/** @jsx JSXSlack.h */
import { View } from '@slack/types'
import JSXSlack, {
  Blocks,
  Escape,
  File,
  Home,
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
        callback_id: 'callback_id',
        external_id: 'external_id',
        submit: { type: 'plain_text', text: 'Submit', emoji: true },
        close: { type: 'plain_text', text: 'Close', emoji: true },
        private_metadata: 'private_metadata',
        clear_on_close: true,
        notify_on_close: false,
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

    it('throws error when <Modal> has unexpected element', () => {
      // <Modal> cannot use file block
      expect(() =>
        JSXSlack(
          <Modal title="test">
            <File externalId="external_id" />
          </Modal>
        )
      ).toThrow()
    })
  })

  describe('<Home>', () => {
    it('generates view payload JSON', () => {
      const view = {
        type: 'home',
        blocks: [{ type: 'section', text: expect.any(Object) }],
      }

      expect(
        JSXSlack(
          <Home>
            <Section>Hello!</Section>
          </Home>
        )
      ).toStrictEqual(view)

      const viewWithOptions = {
        type: 'home',
        callback_id: 'callback_id',
        external_id: 'external_id',
        private_metadata: 'private_metadata',
        blocks: [{ type: 'section', text: expect.any(Object) }],
      }

      expect(
        JSXSlack(
          <Home
            callbackId="callback_id"
            externalId="external_id"
            privateMetadata="private_metadata"
          >
            <Section>Hello!</Section>
          </Home>
        )
      ).toStrictEqual(viewWithOptions)
    })

    it('throws error when <Home> has unexpected element', () => {
      expect(() => JSXSlack(<Home>unexpected</Home>)).toThrow()
      expect(() =>
        JSXSlack(
          <Home>
            <b>unexpected</b>
          </Home>
        )
      ).toThrow()

      expect(() =>
        JSXSlack(
          <Home>
            <File externalId="external_id" />
          </Home>
        )
      ).toThrow()

      expect(() =>
        JSXSlack(
          <Home>
            <Input label="Select">
              <Select>
                <Option value="test">test</Option>
              </Select>
            </Input>
          </Home>
        )
      ).toThrow()
    })
  })
})

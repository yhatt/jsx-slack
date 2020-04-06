/** @jsx JSXSlack.h */
import { PlainTextElement, View } from '@slack/types'
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
  const falseyStr = ''
  const falseyNum = 0

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

    it('ignores invalid literal values to keep compatibillity with v1', () => {
      let blocks: any

      expect(() => {
        blocks = (
          // @ts-ignore
          <Blocks>
            Hello
            {falseyStr && <Section>test</Section>}
            {falseyNum && <Section>test</Section>}
          </Blocks>
        )
      }).not.toThrow()
      expect(blocks).toStrictEqual([])
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

    it('ignores invalid literal values to keep compatibillity with v1', () => {
      let modal: any

      expect(() => {
        modal = (
          // @ts-ignore
          <Modal title="title">
            Hello
            {falseyStr && <Section>test</Section>}
            {falseyNum && <Section>test</Section>}
          </Modal>
        )
      }).not.toThrow()
      expect(modal.blocks).toStrictEqual([])
    })

    it('has default submit field when using input block with omitted submit prop', () => {
      const submit: PlainTextElement = expect.objectContaining({
        type: 'plain_text',
        text: 'Submit',
      })

      expect(
        <Modal title="title">
          <Input label="test" />
        </Modal>
      ).toStrictEqual(expect.objectContaining({ submit }))

      // <input> alias
      expect(
        <Modal title="title">
          <input label="test" />
        </Modal>
      ).toStrictEqual(expect.objectContaining({ submit }))

      // Input layout block
      expect(
        <Modal title="title">
          <Input label="test">
            <Select>
              <Option selected>a</Option>
            </Select>
          </Input>
        </Modal>
      ).toStrictEqual(expect.objectContaining({ submit }))

      // Input component
      expect(
        <Modal title="title">
          <Select label="test">
            <Option selected>a</Option>
          </Select>
        </Modal>
      ).toStrictEqual(expect.objectContaining({ submit }))

      // No input layout block
      expect(
        <Modal title="title">
          <Section>test</Section>
        </Modal>
      ).not.toStrictEqual(expect.objectContaining({ submit }))

      // <Input type="hidden" />
      expect(
        <Modal title="title">
          <Input type="hidden" name="foo" value="bar" />
        </Modal>
      ).not.toStrictEqual(expect.objectContaining({ submit }))
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

    it('ignores invalid literal values to keep compatibillity with v1', () => {
      let home: any

      expect(() => {
        home = (
          // @ts-ignore
          <Home>
            Hello
            {falseyStr && <Section>test</Section>}
            {falseyNum && <Section>test</Section>}
          </Home>
        )
      }).not.toThrow()
      expect(home.blocks).toStrictEqual([])
    })
  })
})

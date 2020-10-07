/** @jsx JSXSlack.h */
import { PlainTextElement, View } from '@slack/types'
import {
  Blocks,
  Call,
  Escape,
  File,
  Home,
  Input,
  JSXSlack,
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
      expect(() => (
        <Blocks>
          <b>unexpected</b>
        </Blocks>
      )).toThrow()

      expect(() => (
        <Blocks>
          <Escape>unexpected</Escape>
        </Blocks>
      )).toThrow()

      // <Input> block cannot use in message
      expect(() => (
        <Blocks>
          <Input label="Select">
            <Select>
              <Option value="test">test</Option>
            </Select>
          </Input>
        </Blocks>
      )).toThrow()

      // Incompatible accessory for section block
      expect(() => (
        <Blocks>
          {
            {
              type: 'section',
              accessory: { type: 'incompatible' },
            } as any
          }
        </Blocks>
      )).toThrow(/incompatible/)

      // Incompatible interactive element for actions block
      expect(() => (
        <Blocks>
          {
            {
              type: 'actions',
              elements: [{ type: 'incompatible' }],
            } as any
          }
        </Blocks>
      )).toThrow(/incompatible/)
    })

    it('ignores invalid literal values to keep compatibillity with v1', () => {
      let blocks: any

      expect(() => {
        blocks = (
          // @ts-expect-error
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
      expect(() =>
        JSXSlack(
          <Modal title="test">
            <File externalId="external_id" />
          </Modal>
        )
      ).toThrow()

      expect(() =>
        JSXSlack(
          <Modal title="test">
            <Call callId="R01234567" />
          </Modal>
        )
      ).toThrow()
    })

    it('ignores invalid literal values to keep compatibillity with v1', () => {
      let modal: any

      expect(() => {
        modal = (
          // @ts-expect-error
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

    describe('with `workflow_step` type', () => {
      it('ignores some props about for around of the modal content', () => {
        expect(
          <Modal type="workflow_step">
            <Input type="submit" value="submit" />
          </Modal>
        ).toStrictEqual({
          type: 'workflow_step',
          blocks: [],
        })

        const workflowStepFull = (
          // @ts-expect-error
          <Modal
            callbackId="callback_id"
            clearOnClose
            close="Close"
            externalId="external_id"
            notifyOnClose={false}
            privateMetadata="private_metadata"
            submit="Submit"
            title="test"
            type="workflow_step"
          >
            <Section>Hello!</Section>
          </Modal>
        )

        expect(workflowStepFull['type']).toBe('workflow_step')
        expect(workflowStepFull).not.toHaveProperty('title')
        expect(workflowStepFull).not.toHaveProperty('submit')
        expect(workflowStepFull).not.toHaveProperty('close')
        expect(workflowStepFull).not.toHaveProperty('clear_on_close')
        expect(workflowStepFull).not.toHaveProperty('notify_on_close')
      })
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

    it('accepts input layout block and input components', () => {
      const inputLayout: any = (
        <Home>
          <Input label="Select">
            <Select>
              <Option value="test">test</Option>
            </Select>
          </Input>
        </Home>
      )
      expect(inputLayout.blocks[0].type).toBe('input')

      const inputComponent: any = (
        <Home>
          <Select label="Select">
            <Option value="test">test</Option>
          </Select>
        </Home>
      )
      expect(inputComponent.blocks[0].type).toBe('input')
    })

    it('accepts <Input type="hidden"> to store private metadata', () => {
      expect(
        JSXSlack(
          <Home>
            <Input type="hidden" name="foo" value="bar" />
            <input type="hidden" name="abc" value="def" />
          </Home>
        ).private_metadata
      ).toBe(JSON.stringify({ foo: 'bar', abc: 'def' }))

      expect(
        JSXSlack(
          <Home privateMetadata="override">
            <Input type="hidden" name="foo" value="bar" />
            <input type="hidden" name="abc" value="def" />
          </Home>
        ).private_metadata
      ).toBe('override')

      // Custom transformer
      expect(
        JSXSlack(
          <Home
            privateMetadata={(meta: any) =>
              meta && new URLSearchParams(meta).toString()
            }
          >
            <Input type="hidden" name="foo" value="bar" />
            <input type="hidden" name="abc" value="def" />
          </Home>
        ).private_metadata
      ).toBe('foo=bar&abc=def')
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
            <Call callId="R01234567" />
          </Home>
        )
      ).toThrow()
    })

    it('ignores invalid literal values to keep compatibillity with v1', () => {
      let home: any

      expect(() => {
        home = (
          // @ts-expect-error
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

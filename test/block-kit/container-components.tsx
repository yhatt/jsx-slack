/** @jsx JSXSlack.h */
/** @jsxFrag JSXSlack.Fragment */
import { PlainTextElement, View } from '@slack/types'
import {
  Actions,
  Blocks,
  Call,
  Escape,
  File,
  FileInput,
  Home,
  Input,
  JSXSlack,
  Modal,
  Option,
  Section,
  Select,
  WorkflowButton,
} from '../../src/index'

beforeEach(() => JSXSlack.exactMode(false))

describe('Container components', () => {
  const falseyStr = ''
  const falseyNum = 0

  describe('<Blocks>', () => {
    it('accepts input layout block and input components', () => {
      const [input]: any = (
        <Blocks>
          <Input label="Select">
            <Select>
              <Option value="test">test</Option>
            </Select>
          </Input>
        </Blocks>
      )
      expect(input.type).toBe('input')

      const [inputComponent]: any = (
        <Blocks>
          <Select label="Select">
            <Option value="test">test</Option>
          </Select>
        </Blocks>
      )
      expect(inputComponent.type).toBe('input')
    })

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

      // <Input type="hidden"> cannot use in message
      expect(() => (
        <Blocks>
          <Input type="hidden" name="foo" value="bar" />
        </Blocks>
      )).toThrow()

      // <input type="submit"> cannot use in message
      expect(() => (
        <Blocks>
          <input type="submit" value="bar" />
        </Blocks>
      )).toThrow()

      expect(() => (
        <Blocks>
          <FileInput label="file" />
        </Blocks>
      )).toThrow(/<FileInput>/)

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
        // @ts-expect-error
        blocks = <Blocks>Hello</Blocks>
      }).not.toThrow()
      expect(blocks).toStrictEqual([])

      expect(() => {
        // @ts-expect-error
        blocks = <Blocks>{falseyStr && <Section>test</Section>}</Blocks>
      }).not.toThrow()
      expect(blocks).toStrictEqual([])

      expect(() => {
        // @ts-expect-error
        blocks = <Blocks>{falseyNum && <Section>test</Section>}</Blocks>
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
          </Modal>,
        ),
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
          </Modal>,
        ),
      ).toStrictEqual(viewWithOptions)
    })

    it('throws error when <Modal> has unexpected element', () => {
      expect(() =>
        JSXSlack(
          <Modal title="test">
            <File externalId="external_id" />
          </Modal>,
        ),
      ).toThrow()

      expect(() =>
        JSXSlack(
          <Modal title="test">
            <Call callId="R01234567" />
          </Modal>,
        ),
      ).toThrow()

      expect(() =>
        JSXSlack(
          <Modal title="test">
            <Section>
              <WorkflowButton
                workflow={{ trigger: { url: 'https://example.com' } }}
              >
                WorkflowButton
              </WorkflowButton>
            </Section>
          </Modal>,
        ),
      ).toThrow()

      expect(() =>
        JSXSlack(
          <Modal title="test">
            <Actions>
              <WorkflowButton
                workflow={{ trigger: { url: 'https://example.com' } }}
              >
                WorkflowButton
              </WorkflowButton>
            </Actions>
          </Modal>,
        ),
      ).toThrow()
    })

    it('ignores invalid literal values to keep compatibillity with v1', () => {
      let modal: any

      expect(() => {
        // @ts-expect-error
        modal = <Modal title="x">Hello</Modal>
      }).not.toThrow()
      expect(modal.blocks).toStrictEqual([])

      expect(() => {
        // @ts-expect-error
        modal = <Modal title="x">{falseyStr && <Section>test</Section>}</Modal>
      }).not.toThrow()
      expect(modal.blocks).toStrictEqual([])

      expect(() => {
        // @ts-expect-error
        modal = <Modal title="x">{falseyNum && <Section>test</Section>}</Modal>
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
        </Modal>,
      ).toStrictEqual(expect.objectContaining({ submit }))

      // <input> alias
      expect(
        <Modal title="title">
          <input label="test" />
        </Modal>,
      ).toStrictEqual(expect.objectContaining({ submit }))

      // Input layout block
      expect(
        <Modal title="title">
          <Input label="test">
            <Select>
              <Option selected>a</Option>
            </Select>
          </Input>
        </Modal>,
      ).toStrictEqual(expect.objectContaining({ submit }))

      // Input component
      expect(
        <Modal title="title">
          <Select label="test">
            <Option selected>a</Option>
          </Select>
        </Modal>,
      ).toStrictEqual(expect.objectContaining({ submit }))

      // No input layout block
      expect(
        <Modal title="title">
          <Section>test</Section>
        </Modal>,
      ).not.toStrictEqual(expect.objectContaining({ submit }))

      // <Input type="hidden" />
      expect(
        <Modal title="title">
          <Input type="hidden" name="foo" value="bar" />
        </Modal>,
      ).not.toStrictEqual(expect.objectContaining({ submit }))
    })

    describe('`workflow_step` type', () => {
      it('ignores some props about for around of the modal content', () => {
        const workflowStep = (
          <Modal type="workflow_step">
            <Input type="submit" value="submit" />
          </Modal>
        )

        expect(workflowStep).toStrictEqual({
          type: 'workflow_step',
          blocks: [],
        })
        expect(workflowStep).not.toHaveProperty('submit_disabled')

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

      describe('submit prop', () => {
        it('assigns submit_disabled field as true if defined submit as false', () => {
          expect(
            <Modal type="workflow_step" submit={false}>
              <></>
            </Modal>,
          ).toStrictEqual({
            type: 'workflow_step',
            submit_disabled: true,
            blocks: [],
          })
        })

        it('assigns submit_disabled field as false if defined truthy value', () => {
          expect(
            <Modal type="workflow_step" submit>
              <></>
            </Modal>,
          ).toStrictEqual({
            type: 'workflow_step',
            submit_disabled: false,
            blocks: [],
          })
        })

        it('does not assign submit_disabled field to the regular modal even if defined as false', () => {
          expect(
            // @ts-expect-error
            <Modal type="modal" submit={false}>
              <></>
            </Modal>,
          ).not.toHaveProperty('submit_disabled')
        })
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
          </Home>,
        ),
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
          </Home>,
        ),
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
          </Home>,
        ).private_metadata,
      ).toBe(JSON.stringify({ foo: 'bar', abc: 'def' }))

      expect(
        JSXSlack(
          <Home privateMetadata="override">
            <Input type="hidden" name="foo" value="bar" />
            <input type="hidden" name="abc" value="def" />
          </Home>,
        ).private_metadata,
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
          </Home>,
        ).private_metadata,
      ).toBe('foo=bar&abc=def')
    })

    it('ignores <Input type="submit">', () => {
      expect(
        <Home>
          <Input type="submit" value="test" />
        </Home>,
      ).toStrictEqual({ type: 'home', blocks: [] })
    })

    it('throws error when <Home> has unexpected element', () => {
      expect(() => (
        <Home>
          <b>unexpected</b>
        </Home>
      )).toThrow()

      expect(() => (
        <Home>
          <File externalId="external_id" />
        </Home>
      )).toThrow()

      expect(() => (
        <Home>
          <Call callId="R01234567" />
        </Home>
      )).toThrow()

      expect(() => (
        <Home>
          <input label="file" type="file" />
        </Home>
      )).toThrow(/<input type="file">/)

      expect(() => (
        <Home>
          <Section>
            <WorkflowButton
              workflow={{ trigger: { url: 'https://example.com' } }}
            >
              WorkflowButton
            </WorkflowButton>
          </Section>
        </Home>
      )).toThrow()

      expect(() => (
        <Home>
          <Actions>
            <WorkflowButton
              workflow={{ trigger: { url: 'https://example.com' } }}
            >
              WorkflowButton
            </WorkflowButton>
          </Actions>
        </Home>
      )).toThrow()
    })

    it('ignores invalid literal values to keep compatibillity with v1', () => {
      let home: any

      expect(() => {
        // @ts-expect-error
        home = <Home>Hello</Home>
      }).not.toThrow()
      expect(home.blocks).toStrictEqual([])

      expect(() => {
        // @ts-expect-error
        home = <Home>{falseyStr && <Section>test</Section>}</Home>
      }).not.toThrow()
      expect(home.blocks).toStrictEqual([])

      expect(() => {
        // @ts-expect-error
        home = <Home>{falseyNum && <Section>test</Section>}</Home>
      }).not.toThrow()
      expect(home.blocks).toStrictEqual([])
    })
  })
})

/** @jsx JSXSlack.h */
import { InputBlock, View } from '@slack/types'
import JSXSlack, {
  Actions,
  Blocks,
  ChannelsSelect,
  Checkbox,
  CheckboxGroup,
  ConversationsSelect,
  DatePicker,
  ExternalSelect,
  Input,
  Modal,
  Option,
  RadioButton,
  RadioButtonGroup,
  Section,
  Select,
  Textarea,
  UsersSelect,
} from '../../../src/index'

beforeEach(() => JSXSlack.exactMode(false))

describe('Input components for modal', () => {
  it('wraps input-compatible block elements in <Input> block when passed label prop', () => {
    for (const Compatible of [
      (props) => (
        <Select {...props}>
          <Option value="test">test</Option>
        </Select>
      ),
      ExternalSelect,
      ChannelsSelect,
      ConversationsSelect,
      UsersSelect,
      DatePicker,
      (props) => (
        <RadioButtonGroup {...props}>
          <RadioButton value="test">test</RadioButton>
        </RadioButtonGroup>
      ),
      (props) => (
        <CheckboxGroup {...props}>
          <Checkbox value="test">test</Checkbox>
        </CheckboxGroup>
      ),
    ]) {
      expect(
        JSXSlack(
          <Modal title="test">
            <Compatible id="test" label="Test" name="name" title="foobar" />
          </Modal>
        )
      ).toStrictEqual(
        JSXSlack(
          <Modal title="test">
            <Input blockId="test" label="Test" hint="foobar">
              <Compatible actionId="name" />
            </Input>
          </Modal>
        )
      )
    }
  })

  describe('<Input> (component)', () => {
    const expected: InputBlock = {
      type: 'input',
      block_id: 'foo',
      label: { type: 'plain_text', text: 'Input', emoji: true },
      hint: { type: 'plain_text', text: 'bar', emoji: true },
      optional: true,
      element: {
        type: 'plain_text_input',
        action_id: 'action',
      },
    }

    it('outputs input block with plain-text input element', () =>
      expect(
        JSXSlack(
          <Modal title="test">
            <Input actionId="action" blockId="foo" hint="bar" label="Input" />
          </Modal>
        ).blocks
      ).toStrictEqual([expected]))

    it('allows using HTML-compatible <input> element', () =>
      expect(
        JSXSlack(
          <Modal title="test">
            <input
              type="text"
              id="foo"
              label="Input"
              name="action"
              title="bar"
            />
          </Modal>
        ).blocks
      ).toStrictEqual([expected]))

    it("marks placeholder's emoji flag as disabled", () => {
      const { blocks: blocksPlaceholder } = JSXSlack(
        <Modal title="test">
          <Input label="placeholder" placeholder="Hi 😃" />
        </Modal>
      )

      expect(blocksPlaceholder[0].element.placeholder).toStrictEqual({
        type: 'plain_text',
        text: 'Hi 😃',
        emoji: false,
      })
    })
  })

  describe('<Input type="hidden">', () => {
    it('assigns private metadata of parent modal as JSON string', () => {
      const modal: View = JSXSlack(
        <Modal title="test">
          <Input type="text" name="a" label="a" />

          <Input type="hidden" name="string" value="foobar" />
          <Input type="hidden" name="number" value={123} />
          <Input type="hidden" name="array" value={[1, 2, 3]} />
          <Input type="hidden" name="object" value={{ test: null }} />
          <Input type="hidden" name="boolean" value={true} />
        </Modal>
      )

      expect(JSON.parse(modal.private_metadata || '')).toStrictEqual({
        string: 'foobar',
        number: 123,
        array: [1, 2, 3],
        object: { test: null },
        boolean: true,
      })
    })

    it('prefers privateMetadata prop of <Modal>', () => {
      const modal: View = JSXSlack(
        <Modal title="test" privateMetadata="customMeta">
          <Input type="text" name="a" label="a" />
          <Input type="hidden" name="foo" value="bar" />
        </Modal>
      )

      expect(modal.private_metadata).toBe('customMeta')
    })

    it('can customize private metadata transformer for assigned hidden values', () => {
      const transformer = jest.fn(
        (hidden) => hidden && new URLSearchParams(hidden).toString()
      )

      expect(
        JSXSlack(
          <Modal title="test" privateMetadata={transformer}>
            <Input type="text" name="a" label="a" />
            <Input type="hidden" name="A" value="foobar" />
            <Input type="hidden" name="B" value={123} />
            <Input type="hidden" name="C" value={true} />
          </Modal>
        ).private_metadata
      ).toBe('A=foobar&B=123&C=true')

      expect(transformer).toBeCalledWith({ A: 'foobar', B: 123, C: true })

      // Transformer will call with undefined when there are no hidden values
      expect(
        JSXSlack(
          <Modal title="test" privateMetadata={transformer}>
            <Input type="text" name="a" label="a" />
          </Modal>
        ).private_metadata
      ).toBeUndefined()

      expect(transformer).toBeCalledWith(undefined)
    })
  })

  describe('<Input type="submit">', () => {
    it('assigns the label of submit to the parent modal', () => {
      const modal: View = JSXSlack(
        <Modal title="test">
          <Input name="a" label="a" />
          <Input type="submit" value="Send!" />
        </Modal>
      )

      expect(modal.submit).toStrictEqual({
        type: 'plain_text',
        text: 'Send!',
        emoji: true,
      })
    })

    it('prefers submit prop of <Modal>', () => {
      const modal: View = JSXSlack(
        <Modal title="test" submit="Submit label">
          <Input name="a" label="a" />
          <Input type="submit" value="Send!" />
        </Modal>
      )

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(modal.submit!.text).toBe('Submit label')
    })
  })

  describe('<Textarea>', () => {
    const expected: InputBlock = {
      type: 'input',
      label: { type: 'plain_text', text: 'textarea', emoji: true },
      optional: true,
      element: {
        type: 'plain_text_input',
        action_id: 'foobar',
        multiline: true,
      },
    }

    it('outputs input block with plain-text input element that is enabled multiline prop', () => {
      const { blocks } = JSXSlack(
        <Modal title="test">
          <Textarea label="textarea" name="foobar" />
        </Modal>
      )

      expect(blocks).toStrictEqual([expected])
    })

    it('allows using HTML-compatible <textarea> element', () => {
      const { blocks } = JSXSlack(
        <Modal title="test">
          <textarea label="textarea" name="foobar" />
        </Modal>
      )

      expect(blocks).toStrictEqual([expected])
    })
  })

  describe('<ConversationsSelect>', () => {
    // TS throws compile error when using responseUrlEnabled without defining
    // label prop (the usage of interactive component, not input component).
    const InvalidConversationsSelect: JSXSlack.FC<any> = ConversationsSelect

    it('allows passing responseUrlEnabled prop in input component', () => {
      const { blocks: icBlocks }: View = JSXSlack(
        <Modal title="test">
          <ConversationsSelect label="test" responseUrlEnabled />
        </Modal>
      )

      expect(icBlocks[0]).toStrictEqual(
        expect.objectContaining({
          type: 'input',
          element: { type: 'conversations_select', response_url_enabled: true },
        })
      )

      const { blocks: ibBlocks }: View = JSXSlack(
        <Modal title="test">
          <Input label="test">
            <InvalidConversationsSelect responseUrlEnabled />
          </Input>
        </Modal>
      )

      expect(ibBlocks[0]).toStrictEqual(
        expect.objectContaining({
          type: 'input',
          element: { type: 'conversations_select', response_url_enabled: true },
        })
      )
    })

    it('does not add response_url_enabled field when multiple prop is enable', () => {
      const { blocks } = JSXSlack(
        <Modal title="test">
          <InvalidConversationsSelect
            label="multiple"
            multiple
            responseUrlEnabled
          />
        </Modal>
      )

      expect(blocks[0].element.type).toBe('multi_conversations_select')
      expect(blocks[0].element.response_url_enabled).toBeUndefined()
    })

    it('throws an error when the component with responseUrlEnabled is using in invalid block', () => {
      expect(() =>
        JSXSlack(
          <Blocks>
            <ConversationsSelect label="select" responseUrlEnabled />
          </Blocks>
        )
      ).toThrowError()

      expect(() =>
        JSXSlack(
          <Modal title="test">
            <Section>
              Select
              <InvalidConversationsSelect responseUrlEnabled />
            </Section>
          </Modal>
        )
      ).toThrowError()

      expect(() =>
        JSXSlack(
          <Modal title="test">
            <Actions>
              <InvalidConversationsSelect responseUrlEnabled />
            </Actions>
          </Modal>
        )
      ).toThrowError()
    })
  })

  describe('<ChannelsSelect>', () => {
    const InvalidChannelsSelect: JSXSlack.FC<any> = ChannelsSelect

    it('allows passing responseUrlEnabled prop in input component', () => {
      const { blocks: icBlocks }: View = JSXSlack(
        <Modal title="test">
          <ChannelsSelect label="test" responseUrlEnabled />
        </Modal>
      )

      expect(icBlocks[0]).toStrictEqual(
        expect.objectContaining({
          type: 'input',
          element: { type: 'channels_select', response_url_enabled: true },
        })
      )

      const { blocks: ibBlocks }: View = JSXSlack(
        <Modal title="test">
          <Input label="test">
            <InvalidChannelsSelect responseUrlEnabled />
          </Input>
        </Modal>
      )

      expect(ibBlocks[0]).toStrictEqual(
        expect.objectContaining({
          type: 'input',
          element: { type: 'channels_select', response_url_enabled: true },
        })
      )
    })

    it('does not add response_url_enabled field when multiple prop is enable', () => {
      const { blocks } = JSXSlack(
        <Modal title="test">
          <InvalidChannelsSelect label="multiple" multiple responseUrlEnabled />
        </Modal>
      )

      expect(blocks[0].element.type).toBe('multi_channels_select')
      expect(blocks[0].element.response_url_enabled).toBeUndefined()
    })

    it('throws an error when the component with responseUrlEnabled is using in invalid block', () => {
      expect(() =>
        JSXSlack(
          <Blocks>
            <ChannelsSelect label="select" responseUrlEnabled />
          </Blocks>
        )
      ).toThrowError()

      expect(() =>
        JSXSlack(
          <Modal title="test">
            <Section>
              Select
              <InvalidChannelsSelect responseUrlEnabled />
            </Section>
          </Modal>
        )
      ).toThrowError()

      expect(() =>
        JSXSlack(
          <Modal title="test">
            <Actions>
              <InvalidChannelsSelect responseUrlEnabled />
            </Actions>
          </Modal>
        )
      ).toThrowError()
    })
  })
})

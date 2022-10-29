/** @jsx JSXSlack.h */
import { InputBlock, View } from '@slack/types'
import {
  Actions,
  ChannelsSelect,
  Checkbox,
  CheckboxGroup,
  ConversationsSelect,
  DatePicker,
  DateTimePicker,
  ExternalSelect,
  Input,
  JSXSlack,
  Modal,
  Option,
  RadioButton,
  RadioButtonGroup,
  Section,
  Select,
  Textarea,
  TimePicker,
  UsersSelect,
} from '../../../src/index'

beforeEach(() => JSXSlack.exactMode(false))

describe('Input components', () => {
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
      DateTimePicker,
      TimePicker,
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
            <Compatible
              id="test"
              label="Test"
              name="name"
              title="foobar"
              dispatchAction
              autoFocus
            />
          </Modal>
        )
      ).toStrictEqual(
        JSXSlack(
          <Modal title="test">
            <Input blockId="test" label="Test" hint="foobar" dispatchAction>
              <Compatible actionId="name" autofocus />
            </Input>
          </Modal>
        )
      )

      // Throw error with helpful message if lacked `label` prop
      expect(() => (
        <Modal title="test">
          <Compatible />
        </Modal>
      )).toThrow(/Are you missing the definition of "label" prop/)
    }
  })

  it('throws a helpful error when using the input component in elsewhere', () => {
    const WildInput: JSXSlack.FC = () => ({ type: 'input' } as any)

    for (const Container of [Actions, Section]) {
      expect(() => (
        <Container>
          <ExternalSelect label="test" />
        </Container>
      )).toThrow(/Please remove "label" prop from <ExternalSelect label="...">/)

      // `<Input>` is invalid in the container other than the modal so the message will be simple
      expect(() => (
        <Container>
          <Input label="test" />
        </Container>
      )).toThrow(/cannot include the element for "input" type: <Input>/)

      // Wild RAW object appeared! (It is not built-in component so we can't provide tag name)
      expect(() => (
        <Container>
          <WildInput />
        </Container>
      )).toThrow(/cannot include the element for "input" type./)
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
        focus_on_load: true,
      },
    }

    it('outputs input block with plain-text input element', () =>
      expect(
        JSXSlack(
          <Modal title="test">
            <Input
              actionId="action"
              blockId="foo"
              hint="bar"
              label="Input"
              autoFocus
            />
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
              autofocus // eslint-disable-line react/no-unknown-property
            />
          </Modal>
        ).blocks
      ).toStrictEqual([expected]))

    describe('dispatchAction prop', () => {
      it('accepts dispatchAction prop as boolean', () => {
        expect(<Input label="input" />).not.toHaveProperty('dispatch_action')
        expect(<Input label="input" dispatchAction />).toHaveProperty(
          'dispatch_action',
          true
        )
        expect(<Input label="input" dispatchAction />).not.toHaveProperty(
          'element.dispatch_action_config'
        )
        expect(<Input label="input" dispatchAction={false} />).toHaveProperty(
          'dispatch_action',
          false
        )
      })

      it('sets dispatch action config composition object if defined dispatchAction prop as specific string', () => {
        const daOCE = (
          <Input label="input" dispatchAction="onCharacterEntered" />
        )
        expect(daOCE).toHaveProperty('dispatch_action', true)
        expect(daOCE).toHaveProperty('element.dispatch_action_config', {
          trigger_actions_on: ['on_character_entered'],
        })

        const daOEP = <Input label="input" dispatchAction="onEnterPressed" />
        expect(daOEP).toHaveProperty('dispatch_action', true)
        expect(daOEP).toHaveProperty('element.dispatch_action_config', {
          trigger_actions_on: ['on_enter_pressed'],
        })

        const daArray = (
          <Input
            label="input"
            dispatchAction={['onEnterPressed', 'onCharacterEntered']}
          />
        )
        expect(daArray).toHaveProperty('dispatch_action', true)
        expect(daArray).toHaveProperty('element.dispatch_action_config', {
          trigger_actions_on: ['on_enter_pressed', 'on_character_entered'],
        })

        const daSpaceSeparated = (
          <Input
            label="input"
            dispatchAction=" onCharacterEntered unknown onEnterPressed onCharacterEntered"
          />
        )
        expect(daSpaceSeparated).toHaveProperty('dispatch_action', true)
        expect(daSpaceSeparated).toHaveProperty(
          'element.dispatch_action_config',
          {
            // Remove duplicated / unknown actions
            trigger_actions_on: ['on_character_entered', 'on_enter_pressed'],
          }
        )
      })

      it('does not set dispatch action config composition but enabled dispatch_action if passed unknown', () => {
        const daUnknown = <Input label="input" dispatchAction="unknown" />
        expect(daUnknown).toHaveProperty('dispatch_action', true)
        expect(daUnknown).not.toHaveProperty('element.dispatch_action_config')
      })
    })

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

  describe('<Input type="url">', () => {
    const expectedInput = {
      type: 'input',
      label: { type: 'plain_text', text: 'URL', emoji: true },
      optional: true,
      element: {
        type: 'url_text_input',
        action_id: 'action',
        focus_on_load: true,
        initial_value: 'https://example.com/',
      },
    }

    it('outputs input block with url text input element', () =>
      expect(
        JSXSlack(
          <Modal title="test">
            <Input
              label="URL"
              type="url"
              actionId="action"
              autoFocus
              value="https://example.com/"
            />
          </Modal>
        ).blocks
      ).toStrictEqual([expectedInput]))

    it('does not include initial_value field if the value is empty', () => {
      const { blocks } = JSXSlack(
        <Modal title="test">
          <input label="url" type="url" value="" />
        </Modal>
      )

      expect(blocks[0].element.type).toBe('url_text_input')
      expect(blocks[0].element).not.toHaveProperty('initial_value')
    })
  })

  describe('<Input type="email">', () => {
    const expectedInput = {
      type: 'input',
      label: { type: 'plain_text', text: 'Email', emoji: true },
      optional: true,
      element: {
        type: 'email_text_input',
        action_id: 'action',
        focus_on_load: true,
        initial_value: 'test@example.com',
      },
    }

    it('outputs input block with email text input element', () =>
      expect(
        JSXSlack(
          <Modal title="test">
            <Input
              label="Email"
              type="email"
              actionId="action"
              autoFocus
              value="test@example.com"
            />
          </Modal>
        ).blocks
      ).toStrictEqual([expectedInput]))

    it('does not include initial_value field if the value is empty', () => {
      const { blocks } = JSXSlack(
        <Modal title="test">
          <input label="Email" type="email" value="" />
        </Modal>
      )

      expect(blocks[0].element.type).toBe('email_text_input')
      expect(blocks[0].element).not.toHaveProperty('initial_value')
    })
  })

  describe('<Input type="number">', () => {
    const expectedInput = {
      type: 'input',
      label: { type: 'plain_text', text: 'Number', emoji: true },
      optional: true,
      element: {
        type: 'number_input',
        action_id: 'action',
        focus_on_load: true,
        initial_value: '0.5',
        is_decimal_allowed: true,
        min_value: '0',
        max_value: '1',
      },
    }

    it('outputs input block with number input element', () =>
      expect(
        JSXSlack(
          <Modal title="test">
            <Input
              label="Number"
              type="number"
              actionId="action"
              autoFocus
              value={0.5}
              decimal
              min={0}
              max={1}
            />
          </Modal>
        ).blocks
      ).toStrictEqual([expectedInput]))

    it('does not include initial_value field if the value is empty', () => {
      const { blocks } = JSXSlack(
        <Modal title="test">
          <input label="Number" type="number" value="" />
        </Modal>
      )

      expect(blocks[0].element.type).toBe('number_input')
      expect(blocks[0].element).not.toHaveProperty('initial_value')
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

      expect(transformer).toHaveBeenCalledWith({ A: 'foobar', B: 123, C: true })

      // Transformer will call with undefined when there are no hidden values
      expect(
        JSXSlack(
          <Modal title="test" privateMetadata={transformer}>
            <Input type="text" name="a" label="a" />
          </Modal>
        ).private_metadata
      ).toBeUndefined()

      expect(transformer).toHaveBeenCalledWith(undefined)
    })
  })

  describe('<Input type="submit">', () => {
    it('assigns the label of submit to the parent modal', () => {
      const modal: View & { type: 'modal' } = JSXSlack(
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
      const modal: View & { type: 'modal' } = JSXSlack(
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
        focus_on_load: true,
      },
    }

    it('outputs input block with plain-text input element that is enabled multiline prop', () => {
      const { blocks } = JSXSlack(
        <Modal title="test">
          <Textarea label="textarea" name="foobar" autoFocus />
        </Modal>
      )

      expect(blocks).toStrictEqual([expected])
    })

    it('allows using HTML-compatible <textarea> element', () => {
      const { blocks } = JSXSlack(
        <Modal title="test">
          {/* eslint-disable-next-line react/no-unknown-property */}
          <textarea label="textarea" name="foobar" autofocus />
        </Modal>
      )

      expect(blocks).toStrictEqual([expected])
    })

    describe('dispatchAction prop', () => {
      it('accepts dispatchAction prop as boolean', () => {
        expect(<Textarea label="textarea" />).not.toHaveProperty(
          'dispatch_action'
        )
        expect(<Textarea label="textarea" dispatchAction />).toHaveProperty(
          'dispatch_action',
          true
        )
        expect(<Textarea label="textarea" dispatchAction />).not.toHaveProperty(
          'element.dispatch_action_config'
        )
        expect(
          <Textarea label="textarea" dispatchAction={false} />
        ).toHaveProperty('dispatch_action', false)
      })

      it('sets dispatch action config composition object if defined dispatchAction prop as specific string', () => {
        const daOCE = (
          <Textarea label="textarea" dispatchAction="onCharacterEntered" />
        )
        expect(daOCE).toHaveProperty('dispatch_action', true)
        expect(daOCE).toHaveProperty('element.dispatch_action_config', {
          trigger_actions_on: ['on_character_entered'],
        })

        const daOEP = (
          <Textarea label="textarea" dispatchAction="onEnterPressed" />
        )
        expect(daOEP).toHaveProperty('dispatch_action', true)
        expect(daOEP).toHaveProperty('element.dispatch_action_config', {
          trigger_actions_on: ['on_enter_pressed'],
        })

        const daArray = (
          <Textarea
            label="textarea"
            dispatchAction={['onEnterPressed', 'onCharacterEntered']}
          />
        )
        expect(daArray).toHaveProperty('dispatch_action', true)
        expect(daArray).toHaveProperty('element.dispatch_action_config', {
          trigger_actions_on: ['on_enter_pressed', 'on_character_entered'],
        })

        const daSpaceSeparated = (
          <Textarea
            label="textarea"
            dispatchAction=" onCharacterEntered unknown onEnterPressed onCharacterEntered"
          />
        )
        expect(daSpaceSeparated).toHaveProperty('dispatch_action', true)
        expect(daSpaceSeparated).toHaveProperty(
          'element.dispatch_action_config',
          {
            // Remove duplicated / unknown actions
            trigger_actions_on: ['on_character_entered', 'on_enter_pressed'],
          }
        )
      })

      it('does not set dispatch action config composition but enabled dispatch_action if passed unknown', () => {
        const daUnknown = <Textarea label="textarea" dispatchAction="unknown" />
        expect(daUnknown).toHaveProperty('dispatch_action', true)
        expect(daUnknown).not.toHaveProperty('element.dispatch_action_config')
      })
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
          <Modal title="test">
            <Section>
              Select
              <InvalidConversationsSelect responseUrlEnabled />
            </Section>
          </Modal>
        )
      ).toThrow()

      expect(() =>
        JSXSlack(
          <Modal title="test">
            <Actions>
              <InvalidConversationsSelect responseUrlEnabled />
            </Actions>
          </Modal>
        )
      ).toThrow()
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
          <Modal title="test">
            <Section>
              Select
              <InvalidChannelsSelect responseUrlEnabled />
            </Section>
          </Modal>
        )
      ).toThrow()

      expect(() =>
        JSXSlack(
          <Modal title="test">
            <Actions>
              <InvalidChannelsSelect responseUrlEnabled />
            </Actions>
          </Modal>
        )
      ).toThrow()
    })
  })
})

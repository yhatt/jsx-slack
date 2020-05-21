/** @jsx JSXSlack.h */
import {
  ActionsBlock,
  Option as SlackOption,
  Overflow as SlackOverflow,
  SectionBlock,
} from '@slack/types'
import JSXSlack, {
  Actions,
  Blocks,
  Button,
  ChannelsSelect,
  CheckboxGroup,
  Checkbox,
  Confirm,
  ConversationsSelect,
  DatePicker,
  ExternalSelect,
  Fragment,
  Home,
  Modal,
  Mrkdwn,
  Optgroup,
  Option,
  Overflow,
  OverflowItem,
  RadioButton,
  RadioButtonGroup,
  Section,
  Select,
  SelectFragment,
  UsersSelect,
} from '../../../src/index'

beforeEach(() => JSXSlack.exactMode(false))

describe('Interactive components', () => {
  const action = (...elements: ActionsBlock['elements']): ActionsBlock => ({
    block_id: 'actions',
    elements,
    type: 'actions',
  })

  describe('<Button>', () => {
    it('outputs button in actions block', () => {
      const buttonAction = action({
        type: 'button',
        action_id: 'action',
        text: { type: 'plain_text', text: 'Hello!', emoji: true },
        value: 'value',
      })

      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <Button actionId="action" value="value">
                Hello!
              </Button>
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([buttonAction])
    })

    it('ignores text formatting in the content', () => {
      expect(
        JSXSlack(
          <Button>
            <b>foo</b>
          </Button>
        ).text.text
      ).toBe('foo')

      expect(
        JSXSlack(
          <Button>
            <i>
              <b>bar</b>
            </i>
          </Button>
        ).text.text
      ).toBe('bar')
    })

    it('allows using HTML-compatible <button> element', () => {
      const buttonAction = action({
        type: 'button',
        action_id: 'action',
        text: { type: 'plain_text', text: 'Hello!', emoji: true },
        value: 'value',
      })

      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <button name="action" value="value">
                Hello!
              </button>
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([buttonAction])
    })

    it('outputs button for link in actions block', () => {
      const buttonAction = action({
        type: 'button',
        url: 'https://example.com/',
        text: { type: 'plain_text', text: 'Link Button', emoji: true },
      })

      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <Button url="https://example.com/">Link Button</Button>
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([buttonAction])
    })

    it('outputs styled button in actions block', () => {
      const buttonAction = action(
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Default', emoji: true },
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Primary', emoji: true },
          style: 'primary',
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Danger', emoji: true },
          style: 'danger',
        }
      )

      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <Button>Default</Button>
              <Button style="primary">Primary</Button>
              <Button style="danger">Danger</Button>
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([buttonAction])
    })

    it('inherits style prop into the confirm composition object', () => {
      const confirm = <Confirm>Are you sure?</Confirm>

      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <Button style="primary" confirm={confirm}>
                Button
              </Button>
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([
        action({
          type: 'button',
          text: { type: 'plain_text', text: 'Button', emoji: true },
          style: 'primary',
          confirm: {
            text: { type: 'mrkdwn', text: 'Are you sure?', verbatim: true },
            style: 'primary',
          },
        } as any),
      ])

      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <Button style="danger" confirm={confirm}>
                Button
              </Button>
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([
        action({
          type: 'button',
          text: { type: 'plain_text', text: 'Button', emoji: true },
          style: 'danger',
          confirm: {
            text: { type: 'mrkdwn', text: 'Are you sure?', verbatim: true },
            style: 'danger',
          },
        } as any),
      ])

      // Prefer style defined in composition object to button
      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <Button
                style="danger"
                confirm={<Confirm style="primary">Are you sure?</Confirm>}
              >
                Button
              </Button>
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([
        action({
          type: 'button',
          text: { type: 'plain_text', text: 'Button', emoji: true },
          style: 'danger',
          confirm: {
            text: { type: 'mrkdwn', text: 'Are you sure?', verbatim: true },
            style: 'primary',
          },
        } as any),
      ])
    })
  })

  describe('<Select>', () => {
    it('outputs select menu for static items in actions block', () => {
      const selectAction = action({
        type: 'static_select',
        action_id: 'select',
        placeholder: { type: 'plain_text', text: 'Select box', emoji: true },
        options: [
          {
            text: { type: 'plain_text', text: '1st', emoji: true },
            value: 'first',
          },
          {
            text: { type: 'plain_text', text: '2nd', emoji: true },
            value: 'second',
          },
          {
            text: { type: 'plain_text', text: '3rd', emoji: true },
            value: 'third',
          },
        ],
      })

      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <Select actionId="select" placeholder="Select box">
                <Option value="first">1st</Option>
                <Option value="second">2nd</Option>
                <Option value="third">3rd</Option>
              </Select>
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([selectAction])
    })

    it('outputs multiple select menu for static items in section block', () => {
      const [section]: SectionBlock[] = JSXSlack(
        <Blocks>
          <Section>
            test
            <Select multiple>
              <Option value="a">a</Option>
              <Option value="b">b</Option>
              <Option value="c">c</Option>
            </Select>
          </Section>
        </Blocks>
      )

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(section.accessory!.type).toBe('multi_static_select')
    })

    it('outputs select menu with grouped items in actions block', () => {
      const selectAction = action({
        type: 'static_select',
        action_id: 'select',
        placeholder: { type: 'plain_text', text: 'Group', emoji: true },
        option_groups: [
          {
            label: { type: 'plain_text', text: 'A', emoji: true },
            options: [
              {
                text: { type: 'plain_text', text: '1st', emoji: true },
                value: 'first',
              },
              {
                text: { type: 'plain_text', text: '2nd', emoji: true },
                value: 'second',
              },
            ],
          },
          {
            label: { type: 'plain_text', text: 'B', emoji: true },
            options: [
              {
                text: { type: 'plain_text', text: '3rd', emoji: true },
                value: 'third',
              },
              {
                text: { type: 'plain_text', text: '4th', emoji: true },
                value: 'fourth',
              },
            ],
          },
        ],
      })

      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <Select actionId="select" placeholder="Group">
                <Optgroup label="A">
                  <Option value="first">1st</Option>
                  <Option value="second">2nd</Option>
                </Optgroup>
                <Optgroup label="B">
                  <Option value="third">3rd</Option>
                  <Option value="fourth">4th</Option>
                </Optgroup>
              </Select>
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([selectAction])
    })

    it('outputs select menu with initial option in actions block', () => {
      const selectAction = action({
        type: 'static_select',
        action_id: 'select',
        options: [
          {
            text: { type: 'plain_text', text: '1st', emoji: true },
            value: 'first',
          },
          {
            text: { type: 'plain_text', text: '2nd', emoji: true },
            value: 'second',
          },
          {
            text: { type: 'plain_text', text: '3rd', emoji: true },
            value: 'third',
          },
        ],
        initial_option: {
          text: { type: 'plain_text', text: '3rd', emoji: true },
          value: 'third',
        },
      })

      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <Select actionId="select" value="third">
                <Option value="first">1st</Option>
                <Option value="second">2nd</Option>
                <Option value="third">3rd</Option>
              </Select>
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([selectAction])
    })

    it('ignores invalid strings in children of select', () => {
      // In TypeScript, <Select> does not allow string in the children.
      const IncompatibleSelect: any = Select

      expect(
        JSXSlack(
          <Blocks>
            <Actions>
              <IncompatibleSelect>
                Ignores invalid string
                <Option value="a">a</Option>
              </IncompatibleSelect>
            </Actions>
          </Blocks>
        )
      ).toStrictEqual(
        JSXSlack(
          <Blocks>
            <Actions>
              <Select>
                <Option value="a">a</Option>
              </Select>
            </Actions>
          </Blocks>
        )
      )
    })

    it('allows using HTML-compatible <select>, <option> and <optgroup> elements', () =>
      expect(
        JSXSlack(
          <Blocks>
            <Actions>
              <select name="test">
                <optgroup label="foo">
                  <option value="bar">bar</option>
                </optgroup>
              </select>
            </Actions>
          </Blocks>
        )
      ).toStrictEqual(
        JSXSlack(
          <Blocks>
            <Actions>
              <Select actionId="test">
                <Optgroup label="foo">
                  <Option value="bar">bar</Option>
                </Optgroup>
              </Select>
            </Actions>
          </Blocks>
        )
      ))

    it('follows selected property in <Option> when value prop was not defined', () => {
      expect(
        <Select>
          <Option>a</Option>
          <Option selected>b</Option>
          <Option>c</Option>
        </Select>
      ).toStrictEqual(
        <Select value="b">
          <Option>a</Option>
          <Option>b</Option>
          <Option>c</Option>
        </Select>
      )

      expect(
        <Select>
          <Optgroup label="test">
            <Option>a</Option>
            <Option selected>b</Option>
            <Option>c</Option>
          </Optgroup>
        </Select>
      ).toStrictEqual(
        <Select value="b">
          <Optgroup label="test">
            <Option>a</Option>
            <Option>b</Option>
            <Option>c</Option>
          </Optgroup>
        </Select>
      )

      expect(
        <Select multiple>
          <Option>a</Option>
          <Option selected>b</Option>
          <Option selected>c</Option>
        </Select>
      ).toStrictEqual(
        <Select multiple value={['b', 'c']}>
          <Option>a</Option>
          <Option>b</Option>
          <Option>c</Option>
        </Select>
      )

      // Select the last option if multiple options were selected in the single select
      expect(
        <Select>
          <Option>a</Option>
          <Option selected>b</Option>
          <Option selected>c</Option>
        </Select>
      ).toStrictEqual(
        <Select value="c">
          <Option>a</Option>
          <Option>b</Option>
          <Option>c</Option>
        </Select>
      )

      // Prefer value property in <Select> component to the selected state in <Option>
      expect(
        <Select value="a">
          <Option>a</Option>
          <Option selected>b</Option>
          <Option>c</Option>
        </Select>
      ).toStrictEqual(
        <Select>
          <Option selected>a</Option>
          <Option>b</Option>
          <Option>c</Option>
        </Select>
      )

      expect(
        <Select multiple value={null}>
          <Option selected>a</Option>
          <Option selected>b</Option>
          <Option selected>c</Option>
        </Select>
      ).toStrictEqual(
        <Select multiple>
          <Option>a</Option>
          <Option>b</Option>
          <Option>c</Option>
        </Select>
      )
    })

    it('uses passed fragment if immediate child is <SelectFragment>', () =>
      expect(
        <Select>
          <SelectFragment>
            <Option>a</Option>
            <Option selected>b</Option>
            <Option>c</Option>
          </SelectFragment>
        </Select>
      ).toStrictEqual(
        <Select>
          <Option>a</Option>
          <Option selected>b</Option>
          <Option>c</Option>
        </Select>
      ))

    it('coercers maxSelectedItems to integer when set with mismatched type', () => {
      const stringNum: any = '3'
      const invalidNum: any = 'invalid'

      expect(
        <Select multiple maxSelectedItems={stringNum}>
          <Option>test</Option>
        </Select>
      ).toStrictEqual(expect.objectContaining({ max_selected_items: 3 }))

      expect(
        <Select multiple maxSelectedItems={invalidNum}>
          <Option>test</Option>
        </Select>
      ).toStrictEqual(
        expect.not.objectContaining({ max_selected_items: expect.anything() })
      )
    })

    it('throws error when passed multiple select in actions block', () =>
      expect(() =>
        JSXSlack(
          <Blocks>
            <Actions>
              <Select multiple>
                <Option value="error">error</Option>
              </Select>
            </Actions>
          </Blocks>
        )
      ).toThrow())

    it('throws error when <Select> has not contained <Option>', () => {
      expect(() =>
        JSXSlack(
          <Blocks>
            <Actions>
              <Select>{}</Select>
            </Actions>
          </Blocks>
        )
      ).toThrow(/must contain/i)

      // <SelectFragment> does not throw error but <Select> does not.
      const emptyFragment = <SelectFragment />
      expect(() => <Select>{emptyFragment}</Select>).toThrow(/must contain/i)
    })

    it('throws error when <Select> has contained invalid block', () =>
      expect(() =>
        JSXSlack(
          <Blocks>
            <Actions>
              <Select>
                <ExternalSelect />
              </Select>
            </Actions>
          </Blocks>
        )
      ).toThrow(/<Option> or <Optgroup>/i))

    it('throws error when <Optgroup> has contained invalid block', () =>
      expect(() => (
        <Select>
          <Optgroup label="group">
            <ExternalSelect />
          </Optgroup>
        </Select>
      )).toThrow(/<ExternalSelect>/i))

    it('ignores invalid literal values in <Optgroup>', () => {
      const group = (
        // @ts-expect-error
        <Optgroup label="group">
          invalid string
          <Option selected>Valid option</Option>
        </Optgroup>
      )

      expect(<Select>{group}</Select>).toStrictEqual(
        <Select>
          <Optgroup label="group">
            <Option selected>Valid option</Option>
          </Optgroup>
        </Select>
      )
    })

    it('throws error when <Select> has mixed children', () =>
      expect(() =>
        JSXSlack(
          <Blocks>
            <Actions>
              <Select>
                <Option value="first">1st</Option>
                <Optgroup label="A">
                  <Option value="second">2nd</Option>
                  <Option value="third">3rd</Option>
                </Optgroup>
              </Select>
            </Actions>
          </Blocks>
        )
      ).toThrow(/cannot be mixed/))
  })

  describe('<ExternalSelect>', () => {
    it('outputs select menu for external items in actions block', () => {
      const initialOption: SlackOption = {
        text: { type: 'plain_text', text: 'value', emoji: false },
        value: 'value',
      }

      const selectAction = action({
        type: 'external_select',
        action_id: 'external',
        placeholder: { type: 'plain_text', text: 'External', emoji: true },
        min_query_length: 4,
        initial_option: initialOption,
      })

      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <ExternalSelect
                actionId="external"
                placeholder="External"
                minQueryLength={4}
                initialOption={initialOption}
              />
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([selectAction])

      // Alias props
      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <ExternalSelect
                name="external"
                placeholder="External"
                minQueryLength={4}
                value={initialOption}
              />
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([selectAction])
    })

    it('outputs select for external items with initial option defined by <Option> in actions block', () => {
      const selectAction = action({
        type: 'external_select',
        initial_option: {
          text: { type: 'plain_text', text: 'Option value', emoji: true },
          value: 'option',
        },
      })

      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <ExternalSelect
                initialOption={<Option value="option">Option value</Option>}
              />
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([selectAction])
    })
  })

  describe('<UsersSelect>', () => {
    it('outputs select for users in actions block', () => {
      const selectAction = action({
        type: 'users_select',
        action_id: 'users',
        placeholder: { type: 'plain_text', text: 'Select user', emoji: true },
        initial_user: 'U01234567',
      })

      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <UsersSelect
                actionId="users"
                placeholder="Select user"
                initialUser="U01234567"
              />
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([selectAction])

      // Alias props
      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <UsersSelect
                name="users"
                placeholder="Select user"
                value="U01234567"
              />
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([selectAction])
    })
  })

  describe('<ConversationsSelect>', () => {
    it('outputs select for conversations in actions block', () => {
      const selectAction = action({
        type: 'conversations_select',
        action_id: 'conversations',
        placeholder: {
          type: 'plain_text',
          text: 'Select conversation',
          emoji: true,
        },
        initial_conversation: 'C89ABCDEF',
      })

      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <ConversationsSelect
                actionId="conversations"
                placeholder="Select conversation"
                initialConversation="C89ABCDEF"
              />
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([selectAction])

      // Alias props
      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <ConversationsSelect
                name="conversations"
                placeholder="Select conversation"
                value="C89ABCDEF"
              />
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([selectAction])
    })

    it('accepts special initial conversation "current" for default_to_current_conversation field', () => {
      expect(
        <ConversationsSelect initialConversation="current" />
      ).toStrictEqual({
        type: 'conversations_select',
        default_to_current_conversation: true,
      })

      expect(<ConversationsSelect multiple value="current" />).toStrictEqual({
        type: 'multi_conversations_select',
        default_to_current_conversation: true,
      })

      // Mixing `initial_conversations` and `default_to_current_conversation` is
      // valid as Block Kit JSON so jsx-slack won't throw any errors. However,
      // Slack will ignore the state of `default_to_current_conversation`. Thus,
      // "current" is not suggestable in array.
      expect(
        <ConversationsSelect
          multiple
          initialConversation={['C0123456789', 'current', 'D0123456789']}
        />
      ).toStrictEqual({
        type: 'multi_conversations_select',
        initial_conversations: ['C0123456789', 'D0123456789'],
        default_to_current_conversation: true,
      })
    })

    it('adds filter composition object when specified filter props', () => {
      const filterCmp = (element: JSXSlack.Node) =>
        JSXSlack(
          <Blocks>
            <Section>test{element}</Section>
          </Blocks>
        )[0].accessory.filter

      expect(filterCmp(<ConversationsSelect />)).toBeUndefined()
      expect(filterCmp(<ConversationsSelect include={[]} />)).toBeUndefined()
      expect(filterCmp(<ConversationsSelect include="" />)).toBeUndefined()
      expect(filterCmp(<ConversationsSelect include=" " />)).toBeUndefined()
      expect(filterCmp(<ConversationsSelect include="?" />)).toBeUndefined()

      expect(
        filterCmp(
          <ConversationsSelect include={['public', 'private', 'im', 'mpim']} />
        )
      ).toStrictEqual({ include: ['public', 'private', 'im', 'mpim'] })
      expect(
        filterCmp(
          <ConversationsSelect multiple include="public private im mpim" />
        )
      ).toStrictEqual({ include: ['public', 'private', 'im', 'mpim'] })
      expect(
        filterCmp(<ConversationsSelect include={['im', 'im']} />)
      ).toStrictEqual({ include: ['im'] })
      expect(
        filterCmp(<ConversationsSelect include="unknown im" />)
      ).toStrictEqual({ include: ['im'] })
      expect(
        filterCmp(<ConversationsSelect include="   public and  private " />)
      ).toStrictEqual({ include: ['public', 'private'] })

      expect(filterCmp(<ConversationsSelect excludeBotUsers />)).toStrictEqual({
        exclude_bot_users: true,
      })

      expect(
        filterCmp(<ConversationsSelect excludeExternalSharedChannels />)
      ).toStrictEqual({
        exclude_external_shared_channels: true,
      })

      expect(
        filterCmp(
          <ConversationsSelect
            include="public im"
            excludeBotUsers
            excludeExternalSharedChannels
          />
        )
      ).toStrictEqual({
        include: ['public', 'im'],
        exclude_bot_users: true,
        exclude_external_shared_channels: true,
      })
    })
  })

  describe('<ChannelsSelect>', () => {
    it('outputs select for channels in actions block', () => {
      const selectAction = action({
        type: 'channels_select',
        action_id: 'channels',
        placeholder: {
          type: 'plain_text',
          text: 'Select channel',
          emoji: true,
        },
        initial_channel: 'C98765432',
      })

      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <ChannelsSelect
                actionId="channels"
                placeholder="Select channel"
                initialChannel="C98765432"
              />
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([selectAction])

      // Alias props
      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <ChannelsSelect
                name="channels"
                placeholder="Select channel"
                value="C98765432"
              />
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([selectAction])
    })
  })

  describe('<Overflow>', () => {
    it('outputs overflow menu in actions block', () => {
      const baseOverflow: SlackOverflow = {
        type: 'overflow',
        action_id: 'overflow_menu',
        options: [
          {
            text: { type: 'plain_text', text: 'Menu A', emoji: true },
            value: 'menu_a',
          },
          {
            text: { type: 'plain_text', text: 'Menu B', emoji: true },
            value: 'menu_b',
          },
          {
            text: { type: 'plain_text', text: 'Menu C', emoji: true },
            value: 'menu_c',
          },
          {
            text: { type: 'plain_text', text: 'Link', emoji: true },
            url: 'https://example.com/',
          },
        ],
      }

      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <Overflow actionId="overflow_menu">
                <OverflowItem value="menu_a">Menu A</OverflowItem>
                <OverflowItem value="menu_b">Menu B</OverflowItem>
                <OverflowItem value="menu_c">Menu C</OverflowItem>
                <OverflowItem url="https://example.com/">Link</OverflowItem>
              </Overflow>
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([action(baseOverflow)])

      // "confirm" prop and HTML-compatible props
      expect(
        JSXSlack(
          <Blocks>
            <Actions id="actions">
              <Overflow
                name="overflow_menu"
                confirm={<Confirm>foobar</Confirm>}
              >
                <OverflowItem value="menu_a">Menu A</OverflowItem>
                <OverflowItem value="menu_b">Menu B</OverflowItem>
                <OverflowItem value="menu_c">Menu C</OverflowItem>
                <OverflowItem url="https://example.com/">Link</OverflowItem>
              </Overflow>
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([
        action({
          ...baseOverflow,
          confirm: { text: { type: 'mrkdwn', text: 'foobar', verbatim: true } },
        }),
      ])
    })

    it('ignores invalid literal values in children', () =>
      expect(
        // @ts-expect-error
        <Overflow>
          invalid string
          <OverflowItem>test</OverflowItem>
        </Overflow>
      ).toStrictEqual(
        <Overflow>
          <OverflowItem>test</OverflowItem>
        </Overflow>
      ))

    it('throws error when <Overflow> has no <OverflowItem> in children', () =>
      expect(() => <Overflow>{}</Overflow>).toThrow())

    it('throws error when <Overflow> has 6 and more <OverflowItem> elements in children', () =>
      expect(() => (
        <Overflow>
          {[...Array(6)].map(() => (
            <OverflowItem>item</OverflowItem>
          ))}
        </Overflow>
      )).toThrow(/6 elements/))

    it('throws error when <Overflow> has unexpected children', () => {
      expect(() => (
        <Overflow>
          <span>invalid</span>
        </Overflow>
      )).toThrow(/<span>/)

      expect(() => (
        <Overflow>
          <Option>opt</Option>
        </Overflow>
      )).toThrow(/<Option>/)
    })
  })

  describe('<DatePicker>', () => {
    it('outputs date picker in actions block', () => {
      const datePickerAction = action({
        type: 'datepicker',
        action_id: 'date_picker',
        placeholder: { type: 'plain_text', text: 'Select date', emoji: true },
        initial_date: '2019-01-23',
      })

      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <DatePicker
                actionId="date_picker"
                placeholder="Select date"
                initialDate={new Date(1548214496000)} // 2019-01-23 12:34:56
              />
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([datePickerAction])

      // Alias props
      expect(
        JSXSlack(
          <Blocks>
            <Actions blockId="actions">
              <DatePicker
                name="date_picker"
                placeholder="Select date"
                value={1548214496000}
              />
            </Actions>
          </Blocks>
        )
      ).toStrictEqual([datePickerAction])
    })
  })

  describe('<RadioButtonGroup>', () => {
    it('outputs radio button group in actions block', () => {
      const radioButtonAction = {
        type: 'radio_buttons',
        action_id: 'radio-buttons',
        options: [
          {
            text: { type: 'mrkdwn', text: '1st', verbatim: true },
            description: {
              type: 'mrkdwn',
              text: 'The first option',
              verbatim: true,
            },
            value: 'first',
          },
          {
            text: { type: 'mrkdwn', text: '*2nd*', verbatim: true },
            description: {
              type: 'mrkdwn',
              text: 'The _second_ option',
              verbatim: true,
            },
            value: 'second',
          },
          {
            text: { type: 'mrkdwn', text: '3rd', verbatim: true },
            value: 'third',
          },
        ],
        initial_option: {
          text: { type: 'mrkdwn', text: '*2nd*', verbatim: true },
          description: {
            type: 'mrkdwn',
            text: 'The _second_ option',
            verbatim: true,
          },
          value: 'second',
        },
      }

      expect(
        JSXSlack(
          <Home>
            <Actions blockId="actions">
              <RadioButtonGroup actionId="radio-buttons" value="second">
                <RadioButton value="first" description="The first option">
                  1st
                </RadioButton>
                <RadioButton
                  value="second"
                  description={
                    <Fragment>
                      The <i>second</i> option
                    </Fragment>
                  }
                >
                  <strong>2nd</strong>
                </RadioButton>
                <RadioButton value="third">3rd</RadioButton>
              </RadioButtonGroup>
            </Actions>
          </Home>
        ).blocks
      ).toStrictEqual([action(radioButtonAction)])

      // `checked` state prop, `confirm` prop and HTML-compatible props in <Modal>
      expect(
        JSXSlack(
          <Modal title="test">
            <Actions id="actions">
              <RadioButtonGroup
                name="radio-buttons"
                confirm={<Confirm>foobar</Confirm>}
              >
                <RadioButton value="first">
                  1st
                  <small>The first option</small>
                </RadioButton>
                <RadioButton value="second" checked>
                  <b>2nd</b>
                  <small>
                    The <i>second</i> option
                  </small>
                </RadioButton>
                <RadioButton value="third">3rd</RadioButton>
              </RadioButtonGroup>
            </Actions>
          </Modal>
        ).blocks
      ).toStrictEqual([
        action({
          ...radioButtonAction,
          confirm: { text: { type: 'mrkdwn', text: 'foobar', verbatim: true } },
        } as any),
      ])
    })

    it('outputs radio button group in section block', () => {
      const [section]: SectionBlock[] = JSXSlack(
        <Home>
          <Section>
            test
            <RadioButtonGroup>
              <RadioButton value="a">A</RadioButton>
            </RadioButtonGroup>
          </Section>
        </Home>
      ).blocks

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(section.accessory!.type).toBe('radio_buttons')
    })

    it('follows checked property in <RadioButton> when value prop was not defined', () => {
      expect(
        <RadioButtonGroup>
          <RadioButton value="a">a</RadioButton>
          <RadioButton value="b" checked>
            b
          </RadioButton>
          <RadioButton value="c">c</RadioButton>
        </RadioButtonGroup>
      ).toStrictEqual(
        <RadioButtonGroup value="b">
          <RadioButton value="a">a</RadioButton>
          <RadioButton value="b">b</RadioButton>
          <RadioButton value="c">c</RadioButton>
        </RadioButtonGroup>
      )

      // Checked the last option if multiple radio buttons were selected
      expect(
        <RadioButtonGroup>
          <RadioButton value="a">a</RadioButton>
          <RadioButton value="b" checked>
            b
          </RadioButton>
          <RadioButton value="c" checked>
            c
          </RadioButton>
        </RadioButtonGroup>
      ).toStrictEqual(
        <RadioButtonGroup value="c">
          <RadioButton value="a">a</RadioButton>
          <RadioButton value="b">b</RadioButton>
          <RadioButton value="c">c</RadioButton>
        </RadioButtonGroup>
      )

      // Prefer value property in <RadioButtonGroup> component to the checked state in <RadioButton>
      expect(
        <RadioButtonGroup value="a">
          <RadioButton value="a">a</RadioButton>
          <RadioButton value="b" checked>
            b
          </RadioButton>
          <RadioButton value="c">c</RadioButton>
        </RadioButtonGroup>
      ).toStrictEqual(
        <RadioButtonGroup value="a">
          <RadioButton value="a">a</RadioButton>
          <RadioButton value="b">b</RadioButton>
          <RadioButton value="c">c</RadioButton>
        </RadioButtonGroup>
      )
    })

    it('ignores invalid literal values in children', () =>
      expect(
        // @ts-expect-error
        <RadioButtonGroup>
          invalid string
          <RadioButton value="a">a</RadioButton>
        </RadioButtonGroup>
      ).toStrictEqual(
        <RadioButtonGroup>
          <RadioButton value="a">a</RadioButton>
        </RadioButtonGroup>
      ))

    it('throws error when <RadioButtonGroup> has not contained <RadioButton>', () => {
      expect(() => <RadioButtonGroup>{}</RadioButtonGroup>).toThrow(
        /must contain/i
      )

      expect(() => (
        <RadioButtonGroup>
          <Option value="wtf">I'm not radio button</Option>
        </RadioButtonGroup>
      )).toThrow(/must contain/i)
    })

    it('throws error when using <RadioButtonGroup> within <Blocks> container', () => {
      expect(() =>
        JSXSlack(
          <Blocks>
            <Section>
              test
              <RadioButtonGroup>
                <RadioButton value="a">A</RadioButton>
              </RadioButtonGroup>
            </Section>
          </Blocks>
        )
      ).toThrow(/incompatible/i)

      expect(() =>
        JSXSlack(
          <Blocks>
            <Actions>
              <RadioButtonGroup>
                <RadioButton value="a">A</RadioButton>
              </RadioButtonGroup>
            </Actions>
          </Blocks>
        )
      ).toThrow(/incompatible/i)
    })
  })

  describe('<CheckboxGroup>', () => {
    it('outputs checkbox group in actions block', () => {
      const checkboxAction = {
        type: 'checkboxes',
        action_id: 'checkboxGroup',
        options: [
          {
            text: { type: 'mrkdwn', text: '*1st*', verbatim: true },
            description: {
              type: 'mrkdwn',
              text: 'The first option',
              verbatim: true,
            },
            value: 'first',
          },
          {
            text: { type: 'mrkdwn', text: '2nd', verbatim: true },
            description: {
              type: 'mrkdwn',
              text: 'The _second_ option',
              verbatim: true,
            },
            value: 'second',
          },
          {
            text: { type: 'mrkdwn', text: '3rd', verbatim: true },
            value: 'third',
          },
        ],
        initial_options: [
          {
            text: { type: 'mrkdwn', text: '2nd', verbatim: true },
            description: {
              type: 'mrkdwn',
              text: 'The _second_ option',
              verbatim: true,
            },
            value: 'second',
          },
        ],
      }

      expect(
        JSXSlack(
          <Home>
            <Actions blockId="actions">
              <CheckboxGroup actionId="checkboxGroup" values={['second']}>
                <Checkbox value="first" description="The first option">
                  <strong>1st</strong>
                </Checkbox>
                <Checkbox
                  value="second"
                  description={
                    <Fragment>
                      The <i>second</i> option
                    </Fragment>
                  }
                >
                  2nd
                </Checkbox>
                <Checkbox value="third">3rd</Checkbox>
              </CheckboxGroup>
            </Actions>
          </Home>
        ).blocks
      ).toStrictEqual([action(checkboxAction)])

      // Alternative ways
      expect(
        JSXSlack(
          <Home>
            <Actions id="actions">
              <CheckboxGroup name="checkboxGroup">
                <Checkbox value="first">
                  *1st*
                  <small>The first option</small>
                </Checkbox>
                <Checkbox
                  value="second"
                  description={['The ', <i>second</i>, ' option']}
                  checked
                >
                  2nd
                </Checkbox>
                <Checkbox value="third">3rd</Checkbox>
              </CheckboxGroup>
            </Actions>
          </Home>
        ).blocks
      ).toStrictEqual([action(checkboxAction)])

      // confirm prop in <Modal>
      expect(
        JSXSlack(
          <Modal title="modal">
            <Actions blockId="actions">
              <CheckboxGroup
                actionId="checkboxGroup"
                confirm={<Confirm>foobar</Confirm>}
              >
                <Checkbox value="first">
                  <Mrkdwn verbatim>
                    <b>1st</b>
                    <small>The first option</small>
                  </Mrkdwn>
                </Checkbox>
                <Checkbox value="second" checked>
                  2nd
                  <small>
                    <Mrkdwn verbatim>
                      The <i>second</i> option
                    </Mrkdwn>
                  </small>
                </Checkbox>
                <Checkbox value="third">3rd</Checkbox>
              </CheckboxGroup>
            </Actions>
          </Modal>
        ).blocks
      ).toStrictEqual([
        action({
          ...checkboxAction,
          confirm: { text: { type: 'mrkdwn', text: 'foobar', verbatim: true } },
        } as any),
      ])
    })

    it('outputs checkbox group in section block', () => {
      const [section]: SectionBlock[] = JSXSlack(
        <Home>
          <Section>
            test
            <CheckboxGroup>
              <Checkbox value="a">A</Checkbox>
            </CheckboxGroup>
          </Section>
        </Home>
      ).blocks

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(section.accessory!.type).toBe('checkboxes')
    })

    it('throws error when <CheckboxGroup> has not contained <Checkbox>', () => {
      expect(() =>
        JSXSlack(
          <Home>
            <Actions>
              <CheckboxGroup>{}</CheckboxGroup>
            </Actions>
          </Home>
        )
      ).toThrow(/must contain/i)

      expect(() =>
        JSXSlack(
          <Home>
            <Actions>
              <CheckboxGroup>
                <Option value="wtf">I'm not checkbox</Option>
              </CheckboxGroup>
            </Actions>
          </Home>
        )
      ).toThrow(/must contain/i)
    })

    it('throws error when using <CheckboxGroup> within <Blocks> container', () => {
      expect(() =>
        JSXSlack(
          <Blocks>
            <Section>
              test
              <CheckboxGroup>
                <Checkbox value="a">A</Checkbox>
              </CheckboxGroup>
            </Section>
          </Blocks>
        )
      ).toThrow(/incompatible/i)

      expect(() =>
        JSXSlack(
          <Blocks>
            <Actions>
              <CheckboxGroup>
                <Checkbox value="a">A</Checkbox>
              </CheckboxGroup>
            </Actions>
          </Blocks>
        )
      ).toThrow(/incompatible/i)
    })

    it('prefers description prop of <Checkbox> rather than the content in <small> element', () => {
      const [section] = JSXSlack(
        <Home>
          <Section>
            test
            <CheckboxGroup>
              <Checkbox value="hello" description="foo">
                Hello!
                <small>bar</small>
              </Checkbox>
            </CheckboxGroup>
          </Section>
        </Home>
      ).blocks

      const [option] = section.accessory.options
      expect(option.description.text).toBe('foo')
    })

    it("inherits content's <Mrkdwn> option into description", () => {
      const [section] = JSXSlack(
        <Home>
          <Section>
            test
            <CheckboxGroup>
              <Checkbox value="regular" description="description">
                Content
              </Checkbox>
              <Checkbox value="inherited" description="description">
                <Mrkdwn verbatim={false}>Content</Mrkdwn>
              </Checkbox>
              <Checkbox
                value="mixed"
                description={<Mrkdwn verbatim={false}>description</Mrkdwn>}
              >
                <Mrkdwn>Content</Mrkdwn>
              </Checkbox>
              <Checkbox value="small-mixed">
                <Mrkdwn>Content</Mrkdwn>
                <small>
                  <Mrkdwn verbatim={false}>description</Mrkdwn>
                </small>
              </Checkbox>
            </CheckboxGroup>
          </Section>
        </Home>
      ).blocks

      const [regular, inherited, mixed, smallMixed] = section.accessory.options
      expect(regular.description.verbatim).toBe(true)
      expect(inherited.description.verbatim).toBe(false)
      expect(mixed.text.verbatim).toBeUndefined()
      expect(mixed.description.verbatim).toBe(false)
      expect(smallMixed.text.verbatim).toBeUndefined()
      expect(smallMixed.description.verbatim).toBe(false)
    })
  })

  it('ignores checked attribute in <Checkbox> when defined value prop in <CheckboxGroup>', () => {
    const [section] = JSXSlack(
      <Home>
        <Section>
          test
          <CheckboxGroup values={['b', 'd']}>
            <Checkbox value="a">A</Checkbox>
            <Checkbox value="b">B</Checkbox>
            <Checkbox value="c" checked={true}>
              C
            </Checkbox>
            <Checkbox value="d" checked={false}>
              D
            </Checkbox>
          </CheckboxGroup>
        </Section>
      </Home>
    ).blocks

    const values = section.accessory.initial_options.map((opt) => opt.value)
    expect(values).toStrictEqual(['b', 'd'])
  })

  it('ignores invalid literal values in children', () =>
    expect(
      // @ts-expect-error
      <CheckboxGroup>
        invalid string
        <Checkbox value="a">a</Checkbox>
      </CheckboxGroup>
    ).toStrictEqual(
      <CheckboxGroup>
        <Checkbox value="a">a</Checkbox>
      </CheckboxGroup>
    ))
})

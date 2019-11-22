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
  Confirm,
  ConversationsSelect,
  DatePicker,
  ExternalSelect,
  Home,
  Modal,
  Optgroup,
  Option,
  Overflow,
  OverflowItem,
  RadioButton,
  RadioButtonGroup,
  Section,
  Select,
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

    it('ignores invalid strings in children of select', () =>
      expect(
        JSXSlack(
          <Blocks>
            <Actions>
              <Select>
                Ignores invalid string
                <Option value="a">a</Option>
              </Select>
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
      ))

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

    it('throws error when <Select> has not contained <Option>', () =>
      expect(() =>
        JSXSlack(
          <Blocks>
            <Actions>
              <Select>{}</Select>
            </Actions>
          </Blocks>
        )
      ).toThrow(/must include/i))

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
      ).toThrow(/unexpected option type/i))

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
      ).toThrow(/only include either of/))
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
                confirm={
                  <Confirm title="a" confirm="b" deny="c">
                    foobar
                  </Confirm>
                }
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
          confirm: {
            title: { type: 'plain_text', text: 'a', emoji: true },
            confirm: { type: 'plain_text', text: 'b', emoji: true },
            deny: { type: 'plain_text', text: 'c', emoji: true },
            text: { type: 'mrkdwn', text: 'foobar', verbatim: true },
          },
        }),
      ])
    })

    it('throws error when <Overflow> has empty children', () =>
      expect(() =>
        JSXSlack(
          <Blocks>
            <Actions>
              <Overflow>{false}</Overflow>
            </Actions>
          </Blocks>
        )
      ).toThrow())

    it('throws error when <Overflow> has unexpected children', () =>
      expect(() =>
        JSXSlack(
          <Blocks>
            <Actions>
              <Overflow>
                <Button>btn</Button>
              </Overflow>
            </Actions>
          </Blocks>
        )
      ).toThrow())
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
    })
  })

  describe('<RadioButtonGroup>', () => {
    it('outputs radio button group in actions block', () => {
      const radioButtonAction = {
        type: 'radio_buttons',
        action_id: 'radio-buttons',
        options: [
          {
            text: { type: 'plain_text', text: '1st', emoji: true },
            description: {
              type: 'plain_text',
              text: 'The first option',
              emoji: true,
            },
            value: 'first',
          },
          {
            text: { type: 'plain_text', text: '2nd', emoji: true },
            description: {
              type: 'plain_text',
              text: 'The second option',
              emoji: true,
            },
            value: 'second',
          },
          {
            text: { type: 'plain_text', text: '3rd', emoji: true },
            value: 'third',
          },
        ],
        initial_option: {
          text: { type: 'plain_text', text: '2nd', emoji: true },
          description: {
            type: 'plain_text',
            text: 'The second option',
            emoji: true,
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
                <RadioButton value="second" description="The second option">
                  2nd
                </RadioButton>
                <RadioButton value="third">3rd</RadioButton>
              </RadioButtonGroup>
            </Actions>
          </Home>
        ).blocks
      ).toStrictEqual([action(radioButtonAction)])

      // "confirm" prop and HTML-compatible props in <Modal>
      expect(
        JSXSlack(
          <Modal title="test">
            <Actions id="actions">
              <RadioButtonGroup
                name="radio-buttons"
                value="second"
                confirm={
                  <Confirm title="a" confirm="b" deny="c">
                    foobar
                  </Confirm>
                }
              >
                <RadioButton value="first" description="The first option">
                  1st
                </RadioButton>
                <RadioButton value="second" description="The second option">
                  2nd
                </RadioButton>
                <RadioButton value="third">3rd</RadioButton>
              </RadioButtonGroup>
            </Actions>
          </Modal>
        ).blocks
      ).toStrictEqual([
        action({
          ...radioButtonAction,
          confirm: {
            title: { type: 'plain_text', text: 'a', emoji: true },
            confirm: { type: 'plain_text', text: 'b', emoji: true },
            deny: { type: 'plain_text', text: 'c', emoji: true },
            text: { type: 'mrkdwn', text: 'foobar', verbatim: true },
          },
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

    it('throws error when <RadioButtonGroup> has not contained <RadioButton>', () => {
      expect(() =>
        JSXSlack(
          <Home>
            <Actions>
              <RadioButtonGroup>{}</RadioButtonGroup>
            </Actions>
          </Home>
        )
      ).toThrow(/must include/i)

      expect(() =>
        JSXSlack(
          <Home>
            <Actions>
              <RadioButtonGroup>
                <Option value="wtf">I'm not radio button</Option>
              </RadioButtonGroup>
            </Actions>
          </Home>
        )
      ).toThrow(/must include/i)
    })

    it('throws error when using <RadioButtonGroup> within <Blocks> container', () =>
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
      ).toThrow(/incompatible/i))
  })
})

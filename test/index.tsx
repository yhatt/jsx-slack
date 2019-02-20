/** @jsx JSXSlack.h */
import {
  ActionsBlock,
  DividerBlock,
  ImageBlock,
  SectionBlock,
  Option as SlackOption,
} from '@slack/client'
import JSXSlack, {
  Actions,
  Block,
  Button,
  Context,
  Divider,
  Image,
  Section,
  Select,
  Option,
  Optgroup,
  ExternalSelect,
  UsersSelect,
  ConversationsSelect,
  ChannelsSelect,
  Overflow,
  OverflowItem,
  DatePicker,
} from '../src/index'

describe('jsx-slack', () => {
  describe('Block Kit as component', () => {
    describe('<Section>', () => {
      const section: SectionBlock = {
        type: 'section',
        block_id: 'hello',
        text: { type: 'mrkdwn', text: 'Hello!', verbatim: false },
      }

      it('outputs section block', () =>
        expect(
          JSXSlack(
            <Block>
              <Section blockId="hello">Hello!</Section>
            </Block>
          )
        ).toStrictEqual([section]))

      it('allows using HTML-compatible <section> element', () =>
        expect(
          JSXSlack(
            <Block>
              <section id="hello">Hello!</section>
            </Block>
          )
        ).toStrictEqual([section]))
    })

    describe('<Divider>', () => {
      const divider: DividerBlock = {
        type: 'divider',
        block_id: 'divider',
      }

      it('outputs divider block', () =>
        expect(
          JSXSlack(
            <Block>
              <Divider blockId="divider" />
            </Block>
          )
        ).toStrictEqual([divider]))

      it('allows using HTML-compatible <hr> element', () =>
        expect(
          JSXSlack(
            <Block>
              <hr id="divider" />
            </Block>
          )
        ).toStrictEqual([divider]))
    })

    describe('<Image>', () => {
      const image: ImageBlock = {
        type: 'image',
        image_url: 'https://example.com/test.jpg',
        alt_text: 'Test image',
        title: {
          type: 'plain_text',
          text: 'This is a test image!',
          emoji: true,
        },
        block_id: 'image',
      }

      it('outputs image block', () =>
        expect(
          JSXSlack(
            <Block>
              <Image
                src="https://example.com/test.jpg"
                alt="Test image"
                title="This is a test image!"
                blockId="image"
              />
            </Block>
          )
        ).toStrictEqual([image]))

      it('allows using HTML-compatible <img> element', () =>
        expect(
          JSXSlack(
            <Block>
              <img
                src="https://example.com/test.jpg"
                alt="Test image"
                title="This is a test image!"
                id="image"
              />
            </Block>
          )
        ).toStrictEqual([image]))
    })

    describe('<Actions>', () => {
      const action = (...elements: ActionsBlock['elements']): ActionsBlock => ({
        block_id: 'actions',
        elements,
        type: 'actions',
      })

      it('outputs actions block with <Button> for action', () => {
        const buttonAction = action({
          type: 'button',
          action_id: 'action',
          text: { type: 'plain_text', text: 'Hello!', emoji: true },
          value: 'value',
        })

        expect(
          JSXSlack(
            <Block>
              <Actions blockId="actions">
                <Button actionId="action" value="value">
                  Hello!
                </Button>
              </Actions>
            </Block>
          )
        ).toStrictEqual([buttonAction])
      })

      it('outputs actions block with <Button> for link', () => {
        const buttonAction = action({
          type: 'button',
          url: 'https://example.com/',
          text: { type: 'plain_text', text: 'Link Button', emoji: true },
        })

        expect(
          JSXSlack(
            <Block>
              <Actions blockId="actions">
                <Button url="https://example.com/">Link Button</Button>
              </Actions>
            </Block>
          )
        ).toStrictEqual([buttonAction])
      })

      it('outputs actions block with <Select> for static items', () => {
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
            <Block>
              <Actions blockId="actions">
                <Select actionId="select" placeholder="Select box">
                  <Option value="first">1st</Option>
                  <Option value="second">2nd</Option>
                  <Option value="third">3rd</Option>
                </Select>
              </Actions>
            </Block>
          )
        ).toStrictEqual([selectAction])
      })

      it('outputs actions block with <Select> and <Optgroup>', () => {
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
            <Block>
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
            </Block>
          )
        ).toStrictEqual([selectAction])
      })

      it('outputs actions block with <Select> and initial option', () => {
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
            <Block>
              <Actions blockId="actions">
                <Select actionId="select" value="third">
                  <Option value="first">1st</Option>
                  <Option value="second">2nd</Option>
                  <Option value="third">3rd</Option>
                </Select>
              </Actions>
            </Block>
          )
        ).toStrictEqual([selectAction])
      })

      it('throws error when <Select> has not contained <Option>', () =>
        expect(() =>
          JSXSlack(
            <Block>
              <Actions>
                <Select>{}</Select>
              </Actions>
            </Block>
          )
        ).toThrow(/must include/))

      it('throws error when <Select> has mixed children', () =>
        expect(() =>
          JSXSlack(
            <Block>
              <Actions>
                <Select>
                  <Option value="first">1st</Option>
                  <Optgroup label="A">
                    <Option value="second">2nd</Option>
                    <Option value="third">3rd</Option>
                  </Optgroup>
                </Select>
              </Actions>
            </Block>
          )
        ).toThrow(/only include either of/))

      it('outputs actions block with <ExternalSelect> for external items', () => {
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
            <Block>
              <Actions blockId="actions">
                <ExternalSelect
                  actionId="external"
                  placeholder="External"
                  minQueryLength={4}
                  initialOption={initialOption}
                />
              </Actions>
            </Block>
          )
        ).toStrictEqual([selectAction])
      })

      it('outputs actions block with <ExternalSelect> and initial option defined by <Option>', () => {
        const selectAction = action({
          type: 'external_select',
          initial_option: {
            text: { type: 'plain_text', text: 'Option value', emoji: true },
            value: 'option',
          },
        })

        expect(
          JSXSlack(
            <Block>
              <Actions blockId="actions">
                <ExternalSelect
                  initialOption={<Option value="option">Option value</Option>}
                />
              </Actions>
            </Block>
          )
        ).toStrictEqual([selectAction])
      })

      it('outputs actions block with <UsersSelect>', () => {
        const selectAction = action({
          type: 'users_select',
          action_id: 'users',
          placeholder: { type: 'plain_text', text: 'Select user', emoji: true },
          initial_user: 'U01234567',
        })

        expect(
          JSXSlack(
            <Block>
              <Actions blockId="actions">
                <UsersSelect
                  actionId="users"
                  placeholder="Select user"
                  initialUser="U01234567"
                />
              </Actions>
            </Block>
          )
        ).toStrictEqual([selectAction])
      })

      it('outputs actions block with <ConversationsSelect>', () => {
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
            <Block>
              <Actions blockId="actions">
                <ConversationsSelect
                  actionId="conversations"
                  placeholder="Select conversation"
                  initialConversation="C89ABCDEF"
                />
              </Actions>
            </Block>
          )
        ).toStrictEqual([selectAction])
      })

      it('outputs actions block with <ChannelsSelect>', () => {
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
            <Block>
              <Actions blockId="actions">
                <ChannelsSelect
                  actionId="channels"
                  placeholder="Select channel"
                  initialChannel="C98765432"
                />
              </Actions>
            </Block>
          )
        ).toStrictEqual([selectAction])
      })

      it('outputs actions block with <Overflow>', () => {
        const overflowAction = action({
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
        })

        expect(
          JSXSlack(
            <Block>
              <Actions blockId="actions">
                <Overflow actionId="overflow_menu">
                  <OverflowItem value="menu_a">Menu A</OverflowItem>
                  <OverflowItem value="menu_b">Menu B</OverflowItem>
                  <OverflowItem value="menu_c">Menu C</OverflowItem>
                  <OverflowItem url="https://example.com/">Link</OverflowItem>
                </Overflow>
              </Actions>
            </Block>
          )
        ).toStrictEqual([overflowAction])
      })

      it.todo('throws error when <Overflow> has unexpected children')
      it.todo('throws error when the number of overflow items is 1')

      it('outputs actions block with <DatePicker>', () => {
        const datePickerAction = action({
          type: 'datepicker',
          action_id: 'date_picker',
          placeholder: { type: 'plain_text', text: 'Select date', emoji: true },
          initial_date: '2019-01-23',
        })

        expect(
          JSXSlack(
            <Block>
              <Actions blockId="actions">
                <DatePicker
                  actionId="date_picker"
                  placeholder="Select date"
                  initialDate={new Date(1548214496000)} // 2019-01-23 12:34:56
                />
              </Actions>
            </Block>
          )
        ).toStrictEqual([datePickerAction])
      })

      it.todo(
        'outputs actions block with <DatePicker> with initial date object'
      )
      it.todo('outputs actions block with action included <Confirm> object')

      it('throws error when the number of elements is 26', () =>
        expect(() =>
          JSXSlack(
            <Block>
              <Actions>
                {[...Array(26)].map(() => (
                  <Button>btn</Button>
                ))}
              </Actions>
            </Block>
          )
        ).toThrow())
    })

    describe('<Context>', () => {
      it('outputs context block', () =>
        expect(
          JSXSlack(
            <Block>
              <Context blockId="context">
                Hello! <b>World!</b>
                <img src="https://example.com/test.jpg" alt="image" />
                Image + Text
              </Context>
            </Block>
          )
        ).toStrictEqual([
          {
            type: 'context',
            block_id: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: 'Hello! *World!*',
                verbatim: false,
              },
              {
                type: 'image',
                image_url: 'https://example.com/test.jpg',
                alt_text: 'image',
              },
              {
                type: 'mrkdwn',
                text: 'Image + Text',
                verbatim: false,
              },
            ],
          },
        ]))

      it('throws error when the number of elements is 11', () =>
        expect(() =>
          JSXSlack(
            <Block>
              <Context>
                <img src="foo" alt="1" />
                2
                <img src="foo" alt="3" />
                4
                <img src="foo" alt="5" />
                6
                <img src="foo" alt="7" />
                7
                <img src="foo" alt="9" />
                10
                <img src="foo" alt="11" />
              </Context>
            </Block>
          )
        ).toThrow())
    })
  })
})

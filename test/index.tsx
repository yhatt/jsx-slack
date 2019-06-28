/** @jsx JSXSlack.h */
import {
  ActionsBlock,
  DividerBlock,
  ImageBlock,
  SectionBlock,
  StaticSelect,
  Option as SlackOption,
} from '@slack/types'
import JSXSlack, {
  Actions,
  Blocks,
  Button,
  ChannelsSelect,
  Confirm,
  Context,
  ConversationsSelect,
  DatePicker,
  Divider,
  Escape,
  ExternalSelect,
  Field,
  Image,
  Optgroup,
  Option,
  Overflow,
  OverflowItem,
  Section,
  Select,
  SelectFragment,
  UsersSelect,
} from '../src/index'

beforeEach(() => JSXSlack.exactMode(false))

describe('jsx-slack', () => {
  describe('Block Kit as component', () => {
    describe('<Section>', () => {
      const section: SectionBlock = {
        type: 'section',
        block_id: 'hello',
        text: { type: 'mrkdwn', text: 'Hello!', verbatim: true },
      }

      it('outputs section block', () =>
        expect(
          JSXSlack(
            <Blocks>
              <Section blockId="hello">Hello!</Section>
            </Blocks>
          )
        ).toStrictEqual([section]))

      it('allows using HTML-compatible <section> element', () =>
        expect(
          JSXSlack(
            <Blocks>
              <section id="hello">Hello!</section>
            </Blocks>
          )
        ).toStrictEqual([section]))

      it('throws error when <Section> has unexpected component', () =>
        expect(() =>
          JSXSlack(
            <Blocks>
              <Section>
                <Divider />
              </Section>
            </Blocks>
          )
        ).toThrow(/unexpected/))
    })

    describe('<Section> with accessory', () => {
      const section: SectionBlock = {
        type: 'section',
        block_id: 'with_image',
        text: { type: 'mrkdwn', text: 'Image example', verbatim: true },
        accessory: {
          type: 'image',
          image_url: 'https://example.com/image.jpg',
          alt_text: 'Example image',
        },
      }

      it('outputs section block with <Image> accessory', () =>
        expect(
          JSXSlack(
            <Blocks>
              <Section blockId="with_image">
                Image example
                <Image
                  src="https://example.com/image.jpg"
                  alt="Example image"
                />
              </Section>
            </Blocks>
          )
        ).toStrictEqual([section]))

      it('output section block with action accessories', () => {
        for (const accessory of [
          <Button>Button</Button>,
          <Select>
            <Option value="sel">Static select</Option>
          </Select>,
          <ExternalSelect />,
          <UsersSelect />,
          <ConversationsSelect />,
          <ChannelsSelect />,
          <Overflow>
            <OverflowItem>Overflow</OverflowItem>
            <OverflowItem>item</OverflowItem>
          </Overflow>,
          <DatePicker />,
        ]) {
          expect(
            JSXSlack(
              <Blocks>
                <Section blockId="with_image">
                  Accessory test
                  {accessory}
                </Section>
              </Blocks>
            )
          ).toStrictEqual([
            expect.objectContaining({
              accessory: expect.objectContaining({ type: expect.any(String) }),
            }),
          ])
        }
      })
    })

    describe('<Section> with fields', () => {
      const section: SectionBlock = {
        type: 'section',
        block_id: 'fields',
        fields: [
          {
            type: 'mrkdwn',
            text: '*Field A*\n123',
            verbatim: true,
          },
          {
            type: 'mrkdwn',
            text: '*Field B*\n456',
            verbatim: true,
          },
        ],
      }

      it('outputs section block with fields option', () =>
        expect(
          JSXSlack(
            <Blocks>
              <Section blockId="fields">
                <Field>
                  <b>Field A</b>
                  <br />
                  {123}
                </Field>
                <Field>
                  <b>Field B</b>
                  <br />
                  {456}
                </Field>
              </Section>
            </Blocks>
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
            <Blocks>
              <Divider blockId="divider" />
            </Blocks>
          )
        ).toStrictEqual([divider]))

      it('allows using HTML-compatible <hr> element', () =>
        expect(
          JSXSlack(
            <Blocks>
              <hr id="divider" />
            </Blocks>
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
            <Blocks>
              <Image
                src="https://example.com/test.jpg"
                alt="Test image"
                title="This is a test image!"
                blockId="image"
              />
            </Blocks>
          )
        ).toStrictEqual([image]))

      it('allows using HTML-compatible <img> element', () =>
        expect(
          JSXSlack(
            <Blocks>
              <img
                src="https://example.com/test.jpg"
                alt="Test image"
                title="This is a test image!"
                id="image"
              />
            </Blocks>
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

      it('outputs actions block with <Button> for link', () => {
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

      it('outputs actions block with styled <Button>', () => {
        // TODO: Remove type casting when supported style field on @slack/types
        const buttonAction = (action as Function)(
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

      it('throws error when <Select> has not contained <Option>', () =>
        expect(() =>
          JSXSlack(
            <Blocks>
              <Actions>
                <Select>{}</Select>
              </Actions>
            </Blocks>
          )
        ).toThrow(/must include/))

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

      it('outputs actions block with <UsersSelect>', () => {
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
        ).toStrictEqual([overflowAction])
      })

      it('throws error when <Overflow> has unexpected children', () =>
        expect(() =>
          JSXSlack(
            <Blocks>
              <Overflow>
                <Button>btn</Button>
                <Button>btn</Button>
              </Overflow>
            </Blocks>
          )
        ).toThrow())

      it('outputs actions block with <DatePicker>', () => {
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

      it('outputs actions block with action included <Confirm> object', () => {
        const buttonAction = action({
          type: 'button',
          text: { type: 'plain_text', text: 'Share', emoji: true },
          confirm: {
            confirm: { type: 'plain_text', text: 'Yes, please', emoji: true },
            deny: { type: 'plain_text', text: 'Cancel', emoji: true },
            title: { type: 'plain_text', text: 'Share to SNS', emoji: true },
            text: {
              type: 'mrkdwn',
              text: '*Are you sure?* Message will be share.',
              verbatim: true,
            },
          },
        })

        expect(
          JSXSlack(
            <Blocks>
              <Actions blockId="actions">
                <Button
                  confirm={
                    <Confirm
                      title="Share to SNS"
                      confirm="Yes, please"
                      deny="Cancel"
                    >
                      <b>Are you sure?</b> Message will be share.
                    </Confirm>
                  }
                >
                  Share
                </Button>
              </Actions>
            </Blocks>
          )
        ).toStrictEqual([buttonAction])
      })

      it('throws error when the number of elements is 26', () =>
        expect(() =>
          JSXSlack(
            <Blocks>
              <Actions>
                {[...Array(26)].map(() => (
                  <Button>btn</Button>
                ))}
              </Actions>
            </Blocks>
          )
        ).toThrow())
    })

    describe('<Context>', () => {
      it('outputs context block', () =>
        expect(
          JSXSlack(
            <Blocks>
              <Context blockId="context">
                Hello! <b>World!</b>
                <img src="https://example.com/test.jpg" alt="image" />
                Image + Text
                <Image
                  src="https://example.com/test2.jpg"
                  alt="image component"
                />
              </Context>
            </Blocks>
          )
        ).toStrictEqual([
          {
            type: 'context',
            block_id: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: 'Hello! *World!*',
                verbatim: true,
              },
              {
                type: 'image',
                image_url: 'https://example.com/test.jpg',
                alt_text: 'image',
              },
              {
                type: 'mrkdwn',
                text: 'Image + Text',
                verbatim: true,
              },
              {
                type: 'image',
                image_url: 'https://example.com/test2.jpg',
                alt_text: 'image component',
              },
            ],
          },
        ]))

      it('throws error when the number of elements is 11', () =>
        expect(() =>
          JSXSlack(
            <Blocks>
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
            </Blocks>
          )
        ).toThrow())
    })
  })

  describe('<Escape> component', () => {
    it('replaces special character in wrapped by <Escape> component', () =>
      expect(
        JSXSlack(
          <Blocks>
            <Section>&gt; *bold* _italic_ ~strikethrough~ `code`</Section>
            <Section>
              <Escape>&gt; *bold* _italic_ ~strikethrough~ `code`</Escape>
            </Section>
          </Blocks>
        )
      ).toStrictEqual([
        expect.objectContaining({
          text: expect.objectContaining({
            text: '&gt; *bold* _italic_ ~strikethrough~ `code`',
          }),
        }),
        expect.objectContaining({
          text: expect.objectContaining({
            text:
              '\u00ad&gt; \u2217bold\u2217 \u02cditalic\u02cd \u223cstrikethrough\u223c \u02cbcode\u02cb',
          }),
        }),
      ]))
  })

  describe('<SelectFragment> component', () => {
    it('allows building object for external data source of <ExternalSelect>', () => {
      const expectedOptions: Required<Pick<StaticSelect, 'options'>> = {
        options: [
          {
            text: { type: 'plain_text', text: 'A', emoji: true },
            value: 'a',
          },
          {
            text: { type: 'plain_text', text: 'B', emoji: true },
            value: 'b',
          },
          {
            text: { type: 'plain_text', text: 'C', emoji: true },
            value: 'c',
          },
        ],
      }

      expect(
        JSXSlack(
          <SelectFragment>
            <Option value="a">A</Option>
            <Option value="b">B</Option>
            <Option value="c">C</Option>
          </SelectFragment>
        )
      ).toStrictEqual(expectedOptions)

      const expectedOptgroups: Required<Pick<StaticSelect, 'option_groups'>> = {
        option_groups: [
          {
            label: { type: 'plain_text', text: 'A', emoji: true },
            options: [
              {
                text: { type: 'plain_text', text: 'one', emoji: true },
                value: '1',
              },
              {
                text: { type: 'plain_text', text: 'two', emoji: true },
                value: '2',
              },
            ],
          },
          {
            label: { type: 'plain_text', text: 'B', emoji: true },
            options: [
              {
                text: { type: 'plain_text', text: 'three', emoji: true },
                value: '3',
              },
              {
                text: { type: 'plain_text', text: 'four', emoji: true },
                value: '4',
              },
            ],
          },
        ],
      }

      expect(
        JSXSlack(
          <SelectFragment>
            <Optgroup label="A">
              <Option value="1">one</Option>
              <Option value="2">two</Option>
            </Optgroup>
            <Optgroup label="B">
              <Option value="3">three</Option>
              <Option value="4">four</Option>
            </Optgroup>
          </SelectFragment>
        )
      ).toStrictEqual(expectedOptgroups)
    })
  })
})

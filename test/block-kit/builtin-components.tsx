/** @jsx JSXSlack.h */
/** @jsxFrag JSXSlack.Fragment */
import { StaticSelect } from '@slack/types'
import {
  Actions,
  Blocks,
  Divider,
  Escape,
  Fragment,
  JSXSlack,
  Optgroup,
  Option,
  Overflow,
  OverflowItem,
  Section,
  Select,
  SelectFragment,
} from '../../src/index'

beforeEach(() => JSXSlack.exactMode(false))

describe('Built-in components', () => {
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
              '\u00ad&gt; <!date^00000000^{_}|*>bold<!date^00000000^{_}|*> <!date^00000000^{_}|_>italic<!date^00000000^{_}|_> <!date^00000000^{_}|~>strikethrough<!date^00000000^{_}|~> <!date^00000000^{_}|`>code<!date^00000000^{_}|`>',
          }),
        }),
      ]))

    it('ignores escaping underscore in valid emoji shorthand', () =>
      expect(
        JSXSlack(
          <Blocks>
            <Section>
              <Escape>_:arrow_down: :custom_emoji: :カスタム＿絵文字:_</Escape>
            </Section>
          </Blocks>
        )
      ).toStrictEqual([
        expect.objectContaining({
          text: expect.objectContaining({
            text:
              '<!date^00000000^{_}|_>:arrow_down: :custom_emoji: :カスタム＿絵文字:<!date^00000000^{_}|_>',
          }),
        }),
      ]))

    it('ignores escaping underscore in valid link', () => {
      expect(
        JSXSlack(
          <Blocks>
            <Section>
              <Escape>
                <a href="https://example.com/a_b_c">_link_</a>
              </Escape>
            </Section>
          </Blocks>
        )
      ).toStrictEqual([
        expect.objectContaining({
          text: expect.objectContaining({
            text: '<https://example.com/a_b_c|\u02cdlink\u02cd>',
          }),
        }),
      ])
    })

    it('ignores escaping underscore in valid time formatting', () => {
      expect(
        JSXSlack(
          <Blocks>
            <Section>
              <Escape>
                <time dateTime={1234567890} fallback="fall_back">
                  {'{date_num} {time_secs}'}
                </time>
              </Escape>
            </Section>
          </Blocks>
        )
      ).toStrictEqual([
        expect.objectContaining({
          text: expect.objectContaining({
            text: '<!date^1234567890^{date_num} {time_secs}|fall_back>',
          }),
        }),
      ])
    })
  })

  describe('<Fragment> component', () => {
    it('allows grouping multiple components for custom block', () => {
      const CustomBlock: JSXSlack.FC<{ children: JSXSlack.ChildElements }> = ({
        children,
      }) => (
        <Fragment>
          <Divider />
          <Section>{children}</Section>
          <Divider />
        </Fragment>
      )

      expect(
        JSXSlack(
          <Blocks>
            <CustomBlock>Hello!</CustomBlock>
          </Blocks>
        )
      ).toStrictEqual(
        JSXSlack(
          <Blocks>
            <Divider />
            <Section>Hello!</Section>
            <Divider />
          </Blocks>
        )
      )
    })

    it('provides equivalent short JSX syntax as <Fragment>', () =>
      expect(
        <>
          a<b>b</b>c
        </>
      ).toStrictEqual(
        <Fragment>
          a<b>b</b>c
        </Fragment>
      ))

    it('allows grouping select options', () => {
      const CustomOptions: JSXSlack.FC = () => (
        <>
          <Option value="a">A</Option>
          <Option value="b">B</Option>
        </>
      )

      // for <Select>
      expect(
        JSXSlack(
          <Blocks>
            <Actions>
              <Select>
                <CustomOptions />
              </Select>
            </Actions>
          </Blocks>
        )
      ).toStrictEqual(
        JSXSlack(
          <Blocks>
            <Actions>
              <Select>
                <Option value="a">A</Option>
                <Option value="b">B</Option>
              </Select>
            </Actions>
          </Blocks>
        )
      )

      // for <SelectFragment>
      expect(
        JSXSlack(
          <SelectFragment>
            <CustomOptions />
          </SelectFragment>
        )
      ).toStrictEqual(
        JSXSlack(
          <SelectFragment>
            <Option value="a">A</Option>
            <Option value="b">B</Option>
          </SelectFragment>
        )
      )
    })

    it('allows grouping overflow items', () => {
      const CustomOverflowItems: JSXSlack.FC = () => (
        <>
          <OverflowItem value="a">A</OverflowItem>
          <OverflowItem value="b">B</OverflowItem>
        </>
      )

      expect(
        JSXSlack(
          <Blocks>
            <Actions>
              <Overflow>
                <CustomOverflowItems />
              </Overflow>
            </Actions>
          </Blocks>
        )
      ).toStrictEqual(
        JSXSlack(
          <Blocks>
            <Actions>
              <Overflow>
                <OverflowItem value="a">A</OverflowItem>
                <OverflowItem value="b">B</OverflowItem>
              </Overflow>
            </Actions>
          </Blocks>
        )
      )
    })

    it('allows grouping multiple HTML elements', () => {
      const CustomList: JSXSlack.FC = () => (
        <>
          <li>A</li>
          <li>B</li>
        </>
      )

      expect(
        JSXSlack(
          <Blocks>
            <Section>
              <ul>
                <CustomList />
              </ul>
            </Section>
          </Blocks>
        )
      ).toStrictEqual(
        JSXSlack(
          <Blocks>
            <Section>
              <ul>
                <li>A</li>
                <li>B</li>
              </ul>
            </Section>
          </Blocks>
        )
      )
    })

    it('allows nested fragments', () => {
      expect(
        JSXSlack(
          <Blocks>
            <>
              <>
                <Section>Nested</Section>
                <Section>fragments</Section>
              </>
              <>
                <Section>with</Section>
                <Section>multiple</Section>
              </>
            </>
            <>
              <>
                <Section>components</Section>
                <Section>are</Section>
              </>
              <>
                <Section>supported</Section>
                <Section>well</Section>
              </>
            </>
          </Blocks>
        )
      ).toStrictEqual(
        JSXSlack(
          <Blocks>
            <Section>Nested</Section>
            <Section>fragments</Section>
            <Section>with</Section>
            <Section>multiple</Section>
            <Section>components</Section>
            <Section>are</Section>
            <Section>supported</Section>
            <Section>well</Section>
          </Blocks>
        )
      )
    })
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

      expect(
        JSXSlack(
          <SelectFragment>
            <option value="a">A</option>
            <option value="b">B</option>
            <option value="c">C</option>
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

      expect(
        JSXSlack(
          <SelectFragment>
            <optgroup label="A">
              <option value="1">one</option>
              <option value="2">two</option>
            </optgroup>
            <optgroup label="B">
              <option value="3">three</option>
              <option value="4">four</option>
            </optgroup>
          </SelectFragment>
        )
      ).toStrictEqual(expectedOptgroups)
    })

    it('allows no options to return empty result', () => {
      expect(JSXSlack(<SelectFragment />)).toStrictEqual({
        options: [],
      })

      expect(JSXSlack(<SelectFragment>{}</SelectFragment>)).toStrictEqual({
        options: [],
      })

      expect(
        JSXSlack(
          <SelectFragment>
            <Optgroup label="empty">{}</Optgroup>
          </SelectFragment>
        )
      ).toStrictEqual({
        options: [],
      })
    })
  })
})

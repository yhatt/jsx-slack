/** @jsx JSXSlack.h */
import {
  DividerBlock,
  FileBlock,
  ImageBlock,
  InputBlock,
  SectionBlock,
} from '@slack/types'
import JSXSlack, {
  Actions,
  Blocks,
  Button,
  ChannelsSelect,
  Context,
  ConversationsSelect,
  DatePicker,
  Divider,
  ExternalSelect,
  Field,
  File,
  Image,
  Input,
  Modal,
  Option,
  Overflow,
  OverflowItem,
  Section,
  Select,
  UsersSelect,
  Call,
} from '../../src/index'

beforeEach(() => JSXSlack.exactMode(false))

describe('Layout blocks', () => {
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

    it('outputs section block with image accessories', () => {
      for (const accessory of [
        <Image
          src="https://example.com/image.jpg"
          alt="Example image"
          title="Extra field (will be omitted)"
        />,
        <img
          src="https://example.com/image.jpg"
          alt="Example image"
          title="Extra field (will be omitted)"
        />,
      ]) {
        expect(
          JSXSlack(
            <Blocks>
              <Section blockId="with_image">
                Image example
                {accessory}
              </Section>
            </Blocks>
          )
        ).toStrictEqual([section])
      }
    })

    it('outputs section block with block element accessories', () => {
      for (const accessory of [
        <Button>Button</Button>,
        <button>button</button>,
        <Select>
          <Option value="select">Static select</Option>
        </Select>,
        <Select multiple>
          <Option value="select">Multiple select</Option>
        </Select>,
        <select>
          <option value="select">intrinsic &lt;select&gt;</option>
        </select>,
        <select multiple>
          <optgroup label="group">
            <option value="select">intrinsic multi-select</option>
          </optgroup>
        </select>,
        <ExternalSelect />,
        <ExternalSelect multiple />,
        <UsersSelect />,
        <UsersSelect multiple />,
        <ConversationsSelect />,
        <ConversationsSelect multiple />,
        <ChannelsSelect />,
        <ChannelsSelect multiple />,
        <Overflow>
          <OverflowItem>Overflow</OverflowItem>
          <OverflowItem>item</OverflowItem>
        </Overflow>,
        <DatePicker />,
      ]) {
        expect(
          JSXSlack(
            <Blocks>
              <Section blockId="with_image">test {accessory}</Section>
            </Blocks>
          )
        ).toStrictEqual([
          expect.objectContaining({
            accessory: expect.objectContaining({ type: expect.any(String) }),
          }),
        ])
      }
    })

    it('outputs section block with multi-select menus', () => {
      // Static multiple select
      const [s] = JSXSlack(
        <Blocks>
          <Section>
            Select
            <Select multiple maxSelectedItems={2} value={['a', 'c']}>
              <Option value="a">a</Option>
              <Option value="b">b</Option>
              <Option value="c">c</Option>
            </Select>
          </Section>
        </Blocks>
      )

      expect(s.accessory.type).toBe('multi_static_select')
      expect(s.accessory.max_selected_items).toBe(2)
      expect(s.accessory.initial_options).toHaveLength(2)

      // Multiple select for external sources
      for (const accessory of [
        <ExternalSelect
          multiple
          maxSelectedItems={2}
          initialOption={<Option value="a">a</Option>}
        />,
        <UsersSelect multiple maxSelectedItems={2} initialUser="U00000000" />,
        <ConversationsSelect
          multiple
          maxSelectedItems={2}
          initialConversation={['C00000000']}
        />,
        <ChannelsSelect
          multiple
          maxSelectedItems={2}
          initialChannel="D00000000"
        />,
      ]) {
        const [ms] = JSXSlack(
          <Blocks>
            <Section>Select {accessory}</Section>
          </Blocks>
        )

        expect(ms.accessory.type.startsWith('multi_')).toBe(true)
        expect(ms.accessory.max_selected_items).toBe(2)

        const initialKey: any = Object.keys(ms.accessory).find((k) =>
          k.startsWith('initial_')
        )
        expect(ms.accessory[initialKey]).toHaveLength(1)
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

    it('throws error when passed 11 fields', () =>
      expect(() => (
        <Section>
          {[...Array(11)].map(() => (
            <Field>test</Field>
          ))}
        </Section>
      )).toThrow())
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
    it('ignores invalid literal values in children', () =>
      expect(
        // @ts-expect-error
        <Actions>
          invalid string
          <Button>Valid button</Button>
        </Actions>
      ).toStrictEqual(
        <Actions>
          <Button>Valid button</Button>
        </Actions>
      ))

    it('throws error when there is invalid element in children', () =>
      expect(() => (
        <Actions>
          <span />
        </Actions>
      )).toThrow(/<span>/))

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

    it('converts <span> elements into mrkdwn elements', () =>
      expect(
        JSXSlack(
          <Blocks>
            <Context>
              <span>
                <b>A</b>
              </span>
              B<br />C<span>D</span>
              <span>
                E <i>F</i> G
              </span>
              H
            </Context>
          </Blocks>
        )
      ).toStrictEqual([
        {
          type: 'context',
          elements: [
            { type: 'mrkdwn', text: '*A*', verbatim: true },
            { type: 'mrkdwn', text: 'B\nC', verbatim: true },
            { type: 'mrkdwn', text: 'D', verbatim: true },
            { type: 'mrkdwn', text: 'E _F_ G', verbatim: true },
            { type: 'mrkdwn', text: 'H', verbatim: true },
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

  describe('<File>', () => {
    const file: FileBlock = {
      block_id: 'file',
      external_id: 'ABCD1',
      source: 'remote',
      type: 'file',
    }

    it('outputs file block', () =>
      expect(
        JSXSlack(
          <Blocks>
            <File blockId="file" externalId="ABCD1" />
          </Blocks>
        )
      ).toStrictEqual([file]))

    it('allows overriding source prop for future use', () =>
      expect(
        JSXSlack(
          <Blocks>
            <File id="file" externalId="ABCD1" source="local" />
          </Blocks>
        )
      ).toStrictEqual([{ ...file, source: 'local' }]))
  })

  describe('<Call>', () => {
    it('outputs call block', () => {
      expect(
        <Blocks>
          <Call id="call_block" callId="R01234567" />
        </Blocks>
      ).toStrictEqual([
        {
          type: 'call',
          block_id: 'call_block',
          call_id: 'R01234567',
        },
      ])

      expect(<Call id="abc" callId="R123" />).toStrictEqual(
        <Call blockId="abc" callId="R123" />
      )
    })
  })

  describe('<Input> (layout block)', () => {
    it('outputs input block with wrapped element', () => {
      const select = (
        <Select>
          <Option value="test">test</Option>
        </Select>
      )

      const expected: InputBlock = {
        type: 'input',
        block_id: 'input-id',
        label: { type: 'plain_text', text: 'Select', emoji: true },
        hint: { type: 'plain_text', text: 'foobar', emoji: true },
        optional: true,
        element: JSXSlack(select),
      }

      const { blocks } = JSXSlack(
        <Modal title="test">
          <Input blockId="input-id" label="Select" hint="foobar">
            {select}
          </Input>
        </Modal>
      )

      expect(blocks).toStrictEqual([expected])

      // HTML-compatible aliases
      expect(
        JSXSlack(
          <Modal title="test">
            <Input
              id="input-id"
              label="Select"
              title="foobar"
              children={select}
            />
          </Modal>
        ).blocks
      ).toStrictEqual(blocks)

      // Intrinsic HTML elements
      expect(
        JSXSlack(
          <Modal title="test">
            <input
              id="input-id"
              label="Select"
              title="foobar"
              children={select}
            />
          </Modal>
        ).blocks
      ).toStrictEqual(blocks)

      expect(
        JSXSlack(
          <Modal title="test">
            <input id="input-id" label="Select" title="foobar">
              {select}
            </input>
          </Modal>
        ).blocks
      ).toStrictEqual(blocks)

      expect(
        JSXSlack(
          <Modal title="test">
            <select id="input-id" label="Select" title="foobar">
              <option value="test">test</option>
            </select>
          </Modal>
        ).blocks
      ).toStrictEqual(blocks)
    })

    it('throws error when wrapped invalid element', () => {
      expect(() =>
        JSXSlack(
          <Modal title="test">
            <Input label="invalid">
              <Overflow actionId="overflow">
                <OverflowItem value="a">A</OverflowItem>
                <OverflowItem value="b">B</OverflowItem>
              </Overflow>
            </Input>
          </Modal>
        )
      ).toThrow(/invalid/)

      expect(() => (
        // @ts-expect-error
        <Input label="invalid">foobar</Input>
      )).toThrow(/invalid/)
    })
  })
})

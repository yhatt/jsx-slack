/** @jsx JSXSlack.h */
import JSXSlack, { Block, Context, Divider, Image, Section } from '../src/index'

describe('jsx-slack', () => {
  describe('Block Kit as component', () => {
    describe('<Section>', () => {
      it('outputs section block', () =>
        expect(
          JSXSlack(
            <Block>
              <Section blockId="hello">Hello!</Section>
            </Block>
          )
        ).toStrictEqual([
          expect.objectContaining({
            type: 'section',
            block_id: 'hello',
            text: {
              type: 'mrkdwn',
              text: 'Hello!',
            },
          }),
        ]))
    })

    describe('<Divider>', () => {
      it('outputs divider block', () =>
        expect(
          JSXSlack(
            <Block>
              <Divider blockId="divider" />
            </Block>
          )
        ).toStrictEqual([
          {
            type: 'divider',
            block_id: 'divider',
          },
        ]))
    })

    describe('<Image>', () => {
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
        ).toStrictEqual([
          {
            type: 'image',
            image_url: 'https://example.com/test.jpg',
            alt_text: 'Test image',
            title: {
              type: 'plain_text',
              text: 'This is a test image!',
              emoji: true,
            },
            block_id: 'image',
          },
        ]))
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
          expect.objectContaining({
            type: 'context',
            block_id: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: 'Hello! *World!*',
              },
              {
                type: 'image',
                image_url: 'https://example.com/test.jpg',
                alt_text: 'image',
              },
              {
                type: 'mrkdwn',
                text: 'Image + Text',
              },
            ],
          }),
        ]))
    })
  })
})

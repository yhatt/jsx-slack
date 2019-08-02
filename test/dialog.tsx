/** @jsx JSXSlack.h */
import { Dialog as SlackDialog } from '@slack/types'
import JSXSlack, { Select as BlockSelect } from '../src/index'
import {
  Dialog,
  DialogValidationError,
  Input,
  Textarea,
  Select,
  Option,
} from '../src/dialog'
import { DialogProps } from '../src/dialog/Dialog'

describe('Dialog support', () => {
  const TestDialog = (props: Partial<DialogProps> = {}) => (
    <Dialog callbackId="callbackId" title="test" {...props}>
      {props.children || <Input name="test" label="test" />}
    </Dialog>
  )

  describe('<Dialog>', () => {
    it('outputs Dialog JSON', () => {
      const state = JSON.stringify({ hiddenState: ['a', 'b', 'c'] })

      const expectedDialog: SlackDialog = {
        callback_id: 'callback',
        title: 'test',
        submit_label: 'Submit dialog',
        state,
        elements: [
          {
            type: 'text',
            name: 'foo',
            label: 'foo',
            optional: false,
          },
          {
            type: 'textarea',
            name: 'bar',
            label: 'bar',
            optional: true,
          },
          {
            type: 'select',
            name: 'select',
            label: 'select',
            optional: true,
            options: [
              { label: 'one', value: '1' },
              { label: 'two', value: '2' },
              { label: 'three', value: '3' },
            ],
          },
        ],
      }

      expect(
        JSXSlack(
          <Dialog
            callbackId="callback"
            state={state}
            submitLabel="Submit dialog"
            title="test"
          >
            <Input name="foo" label="foo" required />
            <Textarea name="bar" label="bar" />
            <Select name="select" label="select">
              <Option value="1">one</Option>
              <Option value="2">two</Option>
              <Option value="3">three</Option>
            </Select>
          </Dialog>
        )
      ).toStrictEqual(expectedDialog)

      // HTML compatible style
      expect(
        JSXSlack(
          <Dialog callbackId="callback" title="test">
            <Input type="hidden" name="hiddenState" value={['a', 'b', 'c']} />
            <Input type="text" name="foo" label="foo" required />
            <Textarea name="bar" label="bar" />
            <Select name="select" label="select">
              <Option value="1">one</Option>
              <Option value="2">two</Option>
              <Option value="3">three</Option>
            </Select>
            <Input type="submit" value="Submit dialog" />
          </Dialog>
        )
      ).toStrictEqual(expectedDialog)
    })

    it('throws error when passed incompatible elements with dialog', () => {
      expect(() => (
        <Dialog callbackId="callback" title="test">
          <BlockSelect>
            <Option value="1">one</Option>
            <Option value="2">two</Option>
            <Option value="3">three</Option>
          </BlockSelect>
        </Dialog>
      )).toThrow(DialogValidationError)

      expect(() => (
        <Dialog callbackId="callback" title="test">
          Text is not allowed
        </Dialog>
      )).toThrow(DialogValidationError)
    })

    it('throws error when the number of passed elements was incorrect', () => {
      expect(() => (
        <TestDialog>
          <Input type="submit" value="test" />
        </TestDialog>
      )).toThrow(/element/)

      expect(() => (
        <TestDialog>
          {[...Array(11)].map((_, i) => (
            <Input name={i.toString()} label={i.toString()} />
          ))}
        </TestDialog>
      )).toThrow(/element/)
    })

    it('throws error when passed invalid title', () => {
      expect(() => <TestDialog title={'a'.repeat(24)} />).not.toThrow()
      expect(() => <TestDialog title={'a'.repeat(25)} />).toThrow(/title/)
    })

    it('throws error when passed invalid callbackId', () => {
      expect(() => <TestDialog callbackId={'a'.repeat(255)} />).not.toThrow()
      expect(() => <TestDialog callbackId={'a'.repeat(256)} />).toThrow(
        /callback/
      )
    })

    it('throws error when passed invalid state', () => {
      expect(() => <TestDialog state={'a'.repeat(3000)} />).not.toThrow()
      expect(() => <TestDialog state={'a'.repeat(3001)} />).toThrow(/state/)

      // Generated JSON from <Input type="hidden" />
      expect(() => (
        <TestDialog>
          <Input type="hidden" name="a" value={'a'.repeat(2992)} />
          <Input name="b" label="dummy" />
        </TestDialog>
      )).not.toThrow()

      expect(() => (
        <TestDialog>
          <Input type="hidden" name="a" value={'a'.repeat(2993)} />
          <Input name="b" label="dummy" />
        </TestDialog>
      )).toThrow(/state/)
    })

    it('throws error when passed invalid submit label', () => {
      expect(() => <TestDialog submitLabel={'a'.repeat(24)} />).not.toThrow()
      expect(() => <TestDialog submitLabel={'a'.repeat(25)} />).toThrow(
        /submit/
      )

      // Specified by <Input type="submit" />
      expect(() => (
        <TestDialog>
          <Input type="submit" value={'a'.repeat(24)} />
          <Input name="b" label="dummy" />
        </TestDialog>
      )).not.toThrow()

      expect(() => (
        <TestDialog>
          <Input type="submit" value={'a'.repeat(25)} />
          <Input name="b" label="dummy" />
        </TestDialog>
      )).toThrow(/submit/)
    })
  })
})

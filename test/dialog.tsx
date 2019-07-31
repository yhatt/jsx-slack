/** @jsx JSXSlack.h */
import { Dialog as SlackDialog } from '@slack/types'
import JSXSlack from '../src/index'
import { Dialog, Input, Textarea, Select, Option } from '../src/dialog'

describe('Dialog support', () => {
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
            <Input name="foo" label="foo" required={true} />
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
            <Input type="text" name="foo" label="foo" required={true} />
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
  })
})

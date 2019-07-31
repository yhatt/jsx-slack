/** @jsx JSXSlack.h */
import { Dialog as SlackDialog } from '@slack/types'
import JSXSlack from '../src/index'
import { Dialog, Input } from '../src/dialog'

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
            type: 'text',
            name: 'bar',
            label: 'bar',
            optional: true,
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
            <Input name="bar" label="bar" />
          </Dialog>
        )
      ).toStrictEqual(expectedDialog)

      // HTML compatible style
      expect(
        JSXSlack(
          <Dialog callbackId="callback" title="test">
            <Input type="hidden" name="hiddenState" value={['a', 'b', 'c']} />
            <Input type="text" name="foo" label="foo" required={true} />
            <Input type="text" name="bar" label="bar" />
            <Input type="submit" value="Submit dialog" />
          </Dialog>
        )
      ).toStrictEqual(expectedDialog)
    })
  })
})

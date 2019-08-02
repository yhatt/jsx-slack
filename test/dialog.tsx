/** @jsx JSXSlack.h */
import { Dialog as SlackDialog } from '@slack/types'
import JSXSlack, { Select as BlockSelect } from '../src/index'
import {
  ChannelsSelect,
  ConversationsSelect,
  Dialog,
  DialogValidationError,
  ExternalSelect,
  Input,
  Optgroup,
  Option,
  Select,
  SelectFragment,
  Textarea,
  UsersSelect,
} from '../src/dialog'
import { DialogProps } from '../src/dialog/Dialog'

type DialogElement = SlackDialog['elements'][0]

describe('Dialog support', () => {
  const TestDialog = (props: Partial<DialogProps> = {}) => (
    <Dialog callbackId="callbackId" title="test" {...props}>
      {props.children || <Input name="test" label="test" />}
    </Dialog>
  )

  const element = (inputJSX: JSXSlack.Node): DialogElement =>
    (JSXSlack(<TestDialog>{inputJSX}</TestDialog>) as SlackDialog).elements[0]

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
          {[...Array(10)].map((_, i) => (
            <Input name={i.toString()} label={i.toString()} />
          ))}
        </TestDialog>
      )).not.toThrow()

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

  describe('<Input>', () => {
    it('outputs text field element', () => {
      const expectedElement: DialogElement = {
        type: 'text',
        name: 'name',
        label: 'label',
        optional: true,
      }

      expect(element(<Input name="name" label="label" />)).toStrictEqual(
        expectedElement
      )
    })

    it('can specify options for text field element', () => {
      const expectedElement: DialogElement = {
        hint: 'hint',
        label: 'label',
        max_length: 30,
        min_length: 5,
        name: 'name',
        optional: false,
        placeholder: 'placeholder',
        type: 'text',
        value: 'default',
      }

      expect(
        element(
          <Input
            hint="hint"
            label="label"
            maxLength={30}
            minLength={5}
            name="name"
            placeholder="placeholder"
            required
            type="text"
            value="default"
          />
        )
      ).toStrictEqual(expectedElement)
    })

    it('maps specified type to correct subtype', () => {
      expect(
        element(<Input type="text" name="text" label="Text" />).subtype
      ).toBeUndefined()

      expect(
        element(<Input type="email" name="email" label="E-mail" />).subtype
      ).toBe('email')

      expect(
        element(<Input type="number" name="number" label="Num" />).subtype
      ).toBe('number')

      expect(element(<Input type="tel" name="tel" label="TEL" />).subtype).toBe(
        'tel'
      )

      expect(element(<Input type="url" name="url" label="URL" />).subtype).toBe(
        'url'
      )
    })

    it('can use title prop as an alias to hint prop', () => {
      expect(element(<Input name="a" label="b" title="TITLE" />)).toStrictEqual(
        element(<Input name="a" label="b" hint="TITLE" />)
      )

      // Use hint prop rather than title prop when both defined
      expect(
        element(<Input name="a" label="b" hint="hint" title="title" />).hint
      ).toBe('hint')
    })

    it('throws error when passed invalid name', () => {
      expect(() => <Input name={'a'.repeat(300)} label="a" />).not.toThrow()
      expect(() => <Input name={'a'.repeat(301)} label="a" />).toThrow(/name/)
    })

    it('throws error when passed invalid label', () => {
      expect(() => <Input label={'a'.repeat(48)} name="a" />).not.toThrow()
      expect(() => <Input label={'a'.repeat(49)} name="a" />).toThrow(/label/)
    })

    it('throws error when passed invalid hint', () => {
      expect(() => (
        <Input hint={'a'.repeat(150)} label="a" name="a" />
      )).not.toThrow()

      expect(() => <Input hint={'a'.repeat(151)} label="a" name="a" />).toThrow(
        /hint/
      )

      expect(() => (
        <Input title={'a'.repeat(151)} label="a" name="a" />
      )).toThrow(/title/)
    })

    it('throws error when passed invalid placeholder', () => {
      expect(() => (
        <Input placeholder={'a'.repeat(150)} label="a" name="a" />
      )).not.toThrow()

      expect(() => (
        <Input placeholder={'a'.repeat(151)} label="a" name="a" />
      )).toThrow(/placeholder/)
    })

    it('throws error when passed invalid value', () => {
      expect(() => (
        <Input value={'a'.repeat(150)} label="a" name="a" />
      )).not.toThrow()

      expect(() => (
        <Input value={'a'.repeat(151)} label="a" name="a" />
      )).toThrow(/value/)
    })

    it('throws error when passed invalid maxLength', () => {
      expect(() => <Input label="a" name="a" maxLength={1} />).not.toThrow()
      expect(() => <Input label="a" name="a" maxLength={0} />).toThrow(
        /maxLength/
      )
      expect(() => <Input label="a" name="a" maxLength={150} />).not.toThrow()
      expect(() => <Input label="a" name="a" maxLength={151} />).toThrow(
        /maxLength/
      )
    })

    it('throws error when passed invalid minLength', () => {
      expect(() => <Input label="a" name="a" minLength={1} />).not.toThrow()
      expect(() => <Input label="a" name="a" minLength={0} />).toThrow(
        /minLength/
      )
      expect(() => <Input label="a" name="a" minLength={150} />).not.toThrow()
      expect(() => <Input label="a" name="a" minLength={151} />).toThrow(
        /minLength/
      )
    })
  })

  describe('<Input type="submit">', () => {
    it('assigns the value of submit_label to the parent dialog', () => {
      const dialog: SlackDialog = JSXSlack(
        <TestDialog>
          <Input name="a" label="a" />
          <Input type="submit" value="Send!" />
        </TestDialog>
      )

      expect(dialog.submit_label).toBe('Send!')
    })

    it('prefers submitLabel prop of <Dialog>', () => {
      const dialog: SlackDialog = JSXSlack(
        <TestDialog submitLabel="Submit label">
          <Input name="a" label="a" />
          <Input type="submit" value="Send!" />
        </TestDialog>
      )

      expect(dialog.submit_label).toBe('Submit label')
    })
  })

  describe('<Input type="hidden">', () => {
    it('assigns the state of parent dialog as JSON string', () => {
      const dialog: SlackDialog = JSXSlack(
        <TestDialog>
          <Input name="a" label="a" />
          <Input type="hidden" name="foo" value="bar" />
        </TestDialog>
      )

      expect(dialog.state).toBe('{"foo":"bar"}')
    })

    it('allows assigning any primitive value(s) by multiple hidden elements', () => {
      const { state } = JSXSlack(
        <TestDialog>
          <Input name="a" label="a" />
          <Input type="hidden" name="foo" value="foo" />
          <Input type="hidden" name="bar" value={123.45} />
          <Input type="hidden" name="test" value={['a', 'b', 1, 2]} />
          <Input type="hidden" name="succeeded" value={true} />
          <Input type="hidden" name="obj" value={{ test: null }} />
        </TestDialog>
      )

      expect(JSON.parse(state)).toStrictEqual({
        bar: 123.45,
        foo: 'foo',
        obj: { test: null },
        succeeded: true,
        test: ['a', 'b', 1, 2],
      })
    })

    it('prefers state prop of <Dialog>', () => {
      const dialog: SlackDialog = JSXSlack(
        <TestDialog state="customState">
          <Input name="a" label="a" />
          <Input type="hidden" name="foo" value="bar" />
        </TestDialog>
      )

      expect(dialog.state).toBe('customState')
    })
  })

  describe('<Textarea>', () => {
    it('outputs textarea element', () => {
      const expectedElement: DialogElement = {
        type: 'textarea',
        name: 'name',
        label: 'label',
        optional: true,
      }

      expect(element(<Textarea name="name" label="label" />)).toStrictEqual(
        expectedElement
      )
    })

    it('can specify options for textarea element', () => {
      const expectedElement: DialogElement = {
        hint: 'hint',
        label: 'label',
        max_length: 140,
        min_length: 10,
        name: 'name',
        optional: false,
        placeholder: 'placeholder',
        subtype: 'number',
        type: 'textarea',
        value: 'default',
      }

      expect(
        element(
          <Textarea
            hint="hint"
            label="label"
            maxLength={140}
            minLength={10}
            name="name"
            placeholder="placeholder"
            required
            subtype="number"
            value="default"
          />
        )
      ).toStrictEqual(expectedElement)
    })

    it('can use title prop as an alias to hint prop', () => {
      expect(
        element(<Textarea name="a" label="b" title="TITLE" />)
      ).toStrictEqual(element(<Textarea name="a" label="b" hint="TITLE" />))

      // Use hint prop rather than title prop when both defined
      expect(
        element(<Textarea name="a" label="b" hint="hint" title="title" />).hint
      ).toBe('hint')
    })

    it('throws error when passed invalid name', () => {
      expect(() => <Textarea name={'a'.repeat(300)} label="a" />).not.toThrow()
      expect(() => <Textarea name={'a'.repeat(301)} label="a" />).toThrow(
        /name/
      )
    })

    it('throws error when passed invalid label', () => {
      expect(() => <Textarea label={'a'.repeat(48)} name="a" />).not.toThrow()
      expect(() => <Textarea label={'a'.repeat(49)} name="a" />).toThrow(
        /label/
      )
    })

    it('throws error when passed invalid hint', () => {
      expect(() => (
        <Textarea hint={'a'.repeat(150)} label="a" name="a" />
      )).not.toThrow()

      expect(() => (
        <Textarea hint={'a'.repeat(151)} label="a" name="a" />
      )).toThrow(/hint/)

      expect(() => (
        <Textarea title={'a'.repeat(151)} label="a" name="a" />
      )).toThrow(/title/)
    })

    it('throws error when passed invalid placeholder', () => {
      expect(() => (
        <Textarea placeholder={'a'.repeat(150)} label="a" name="a" />
      )).not.toThrow()

      expect(() => (
        <Textarea placeholder={'a'.repeat(151)} label="a" name="a" />
      )).toThrow(/placeholder/)
    })

    it('throws error when passed invalid value', () => {
      expect(() => (
        <Textarea value={'a'.repeat(3000)} label="a" name="a" />
      )).not.toThrow()

      expect(() => (
        <Textarea value={'a'.repeat(3001)} label="a" name="a" />
      )).toThrow(/value/)
    })

    it('throws error when passed invalid maxLength', () => {
      expect(() => <Textarea label="a" name="a" maxLength={1} />).not.toThrow()
      expect(() => <Textarea label="a" name="a" maxLength={0} />).toThrow(
        /maxLength/
      )

      expect(() => (
        <Textarea label="a" name="a" maxLength={3000} />
      )).not.toThrow()

      expect(() => <Textarea label="a" name="a" maxLength={3001} />).toThrow(
        /maxLength/
      )
    })

    it('throws error when passed invalid minLength', () => {
      expect(() => <Textarea label="a" name="a" minLength={0} />).not.toThrow()
      expect(() => <Textarea label="a" name="a" minLength={-1} />).toThrow(
        /minLength/
      )

      expect(() => (
        <Textarea label="a" name="a" minLength={3000} />
      )).not.toThrow()

      expect(() => <Textarea label="a" name="a" minLength={3001} />).toThrow(
        /minLength/
      )
    })
  })

  describe('<Select>', () => {
    it('outputs static select element', () => {
      // w/ <Option>
      const expectedElementForOption: DialogElement = {
        type: 'select',
        name: 'name',
        label: 'label',
        optional: true,
        options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }],
      }

      expect(
        element(
          <Select name="name" label="label">
            <Option value="a">A</Option>
            <Option value="b">B</Option>
          </Select>
        )
      ).toStrictEqual(expectedElementForOption)

      // w/ <Optgroup>
      const expectedElementForOptgroup: DialogElement = {
        type: 'select',
        name: 'name',
        label: 'label',
        hint: 'hint',
        optional: false,
        option_groups: [
          {
            label: 'A',
            options: [
              { label: '1', value: 'one' },
              { label: '2', value: 'two' },
            ],
          },
          {
            label: 'B',
            options: [
              { label: '3', value: 'three' },
              { label: '4', value: 'four' },
            ],
          },
        ],
      }

      expect(
        element(
          <Select name="name" label="label" hint="hint" required>
            <Optgroup label="A">
              <Option value="one">1</Option>
              <Option value="two">2</Option>
            </Optgroup>
            <Optgroup label="B">
              <Option value="three">3</Option>
              <Option value="four">4</Option>
            </Optgroup>
          </Select>
        )
      ).toStrictEqual(expectedElementForOptgroup)
    })

    it('can use title prop as an alias to hint prop', () => {
      expect(
        element(
          <Select name="a" label="b" title="TITLE">
            <Option value="a">A</Option>
          </Select>
        )
      ).toStrictEqual(
        element(
          <Select name="a" label="b" hint="TITLE">
            <Option value="a">A</Option>
          </Select>
        )
      )

      // Use hint prop rather than title prop when both defined
      expect(
        element(
          <Select name="a" label="b" hint="hint" title="title">
            <Option value="a">A</Option>
          </Select>
        ).hint
      ).toBe('hint')
    })

    it('throws error when <Select> has not contained option elements', () => {
      expect(() => (
        <Select name="a" label="a">
          {}
        </Select>
      )).toThrow(/must include/)
    })

    it('throws error when <Select> has contained invalid component', () => {
      expect(() => (
        <Select name="a" label="a">
          <Input name="b" label="b" />
        </Select>
      )).toThrow(/unexpected/i)
    })

    it('throws error when <Select> has mixed children', () => {
      expect(() => (
        <Select name="a" label="a">
          <Option value="first">1st</Option>
          <Optgroup label="A">
            <Option value="second">2nd</Option>
            <Option value="third">3rd</Option>
          </Optgroup>
        </Select>
      )).toThrow(/only include either of/)
    })

    it('throws error when <Select> has over 100 options', () => {
      expect(() => (
        <Select name="a" label="a">
          {[...Array(100)].map((_, i) => (
            <Option value={i.toString()}>{i}</Option>
          ))}
        </Select>
      )).not.toThrow()

      expect(() => (
        <Select name="a" label="a">
          {[...Array(101)].map((_, i) => (
            <Option value={i.toString()}>{i}</Option>
          ))}
        </Select>
      )).toThrow(/options/)

      // <Optgroup>
      expect(() => (
        <Select name="a" label="a">
          <Optgroup label="A">
            {[...Array(50)].map((_, i) => (
              <Option value={`A${i}`}>{i}</Option>
            ))}
          </Optgroup>
          <Optgroup label="B">
            {[...Array(50)].map((_, i) => (
              <Option value={`B${i}`}>{i}</Option>
            ))}
          </Optgroup>
        </Select>
      )).not.toThrow()

      expect(() => (
        <Select name="a" label="a">
          <Optgroup label="A">
            {[...Array(50)].map((_, i) => (
              <Option value={`A${i}`}>{i}</Option>
            ))}
          </Optgroup>
          <Optgroup label="B">
            {[...Array(51)].map((_, i) => (
              <Option value={`B${i}`}>{i}</Option>
            ))}
          </Optgroup>
        </Select>
      )).toThrow(/options/)
    })

    it('throws error when passed invalid name', () => {
      expect(() => (
        <Select name={'a'.repeat(300)} label="a">
          <Option value="a">A</Option>
        </Select>
      )).not.toThrow()

      expect(() => (
        <Select name={'a'.repeat(301)} label="a">
          <Option value="a">A</Option>
        </Select>
      )).toThrow(/name/)
    })

    it('throws error when passed invalid label', () => {
      expect(() => (
        <Select label={'a'.repeat(48)} name="a">
          <Option value="a">A</Option>
        </Select>
      )).not.toThrow()

      expect(() => (
        <Select label={'a'.repeat(49)} name="a">
          <Option value="a">A</Option>
        </Select>
      )).toThrow(/label/)

      // Label of <Option>
      expect(() => (
        <Select label="a" name="a">
          <Option value="a">{'A'.repeat(75)}</Option>
        </Select>
      )).not.toThrow()

      expect(() => (
        <Select label="a" name="a">
          <Option value="a">{'A'.repeat(76)}</Option>
        </Select>
      )).toThrow(/label/)

      // Label of <Optgroup>
      expect(() => (
        <Select label="a" name="a">
          <Optgroup label={'A'.repeat(75)}>
            <Option value="a">A</Option>
          </Optgroup>
        </Select>
      )).not.toThrow()

      expect(() => (
        <Select label="a" name="a">
          <Optgroup label={'A'.repeat(76)}>
            <Option value="a">A</Option>
          </Optgroup>
        </Select>
      )).toThrow(/label/)
    })

    it('throws error when passed invalid placeholder', () => {
      expect(() => (
        <Select placeholder={'a'.repeat(150)} label="a" name="a">
          <Option value="a">A</Option>
        </Select>
      )).not.toThrow()

      expect(() => (
        <Select placeholder={'a'.repeat(151)} label="a" name="a">
          <Option value="a">A</Option>
        </Select>
      )).toThrow(/placeholder/)
    })

    it('throws error when passed invalid hint', () => {
      expect(() => (
        <Select hint={'a'.repeat(150)} label="a" name="a">
          <Option value="a">A</Option>
        </Select>
      )).not.toThrow()

      expect(() => (
        <Select hint={'a'.repeat(151)} label="a" name="a">
          <Option value="a">A</Option>
        </Select>
      )).toThrow(/hint/)

      expect(() => (
        <Select title={'a'.repeat(151)} label="a" name="a">
          <Option value="a">A</Option>
        </Select>
      )).toThrow(/title/)
    })

    it('throws error when passed option has invalid value', () => {
      expect(() => (
        <Select label="a" name="a" value={'A'.repeat(75)}>
          <Option value={'A'.repeat(75)}>A</Option>
        </Select>
      )).not.toThrow()

      expect(() => (
        <Select label="a" name="a" value={'A'.repeat(76)}>
          <Option value={'A'.repeat(76)}>A</Option>
        </Select>
      )).toThrow(/value/)

      // <Option> in <Optgroup>
      expect(() => (
        <Select label="a" name="a" value={'A'.repeat(75)}>
          <Optgroup label="A">
            <Option value={'A'.repeat(75)}>A</Option>
          </Optgroup>
        </Select>
      )).not.toThrow()

      expect(() => (
        <Select label="a" name="a" value={'A'.repeat(76)}>
          <Optgroup label="A">
            <Option value={'A'.repeat(76)}>A</Option>
          </Optgroup>
        </Select>
      )).toThrow(/value/)
    })
  })

  describe('<ExternalSelect>', () => {
    it('outputs external select element', () => {
      const expectedElement: DialogElement = {
        data_source: 'external',
        label: 'label',
        name: 'name',
        optional: true,
        type: 'select',
      }

      expect(
        element(<ExternalSelect name="name" label="label" />)
      ).toStrictEqual(expectedElement)
    })

    it('can specify options for external select element', () => {
      const expectedElement: DialogElement = {
        data_source: 'external',
        label: 'label',
        min_query_length: 2,
        name: 'name',
        optional: false,
        placeholder: 'placeholder',
        type: 'select',
        selected_options: [{ label: 'foo', value: 'bar' }],
      }

      expect(
        element(
          <ExternalSelect
            label="label"
            name="name"
            placeholder="placeholder"
            required
            initialOption={{ label: 'foo', value: 'bar' }}
            minQueryLength={2}
          />
        )
      ).toStrictEqual(expectedElement)
    })

    it('can use <Option> element to set selected option as initial value', () =>
      expect(
        element(
          <ExternalSelect
            label="label"
            name="name"
            initialOption={<Option value="bar">foo</Option>}
          />
        ).selected_options
      ).toStrictEqual([{ label: 'foo', value: 'bar' }]))
  })

  describe('<UsersSelect>', () => {
    it('outputs select element with users data source', () => {
      const expectedElement: DialogElement = {
        data_source: 'users',
        label: 'label',
        name: 'name',
        optional: true,
        type: 'select',
        value: 'U01234567',
      }

      expect(
        element(
          <UsersSelect name="name" label="label" initialUser="U01234567" />
        )
      ).toStrictEqual(expectedElement)
    })
  })

  describe('<ChannelsSelect>', () => {
    it('outputs select element with channels data source', () => {
      const expectedElement: DialogElement = {
        data_source: 'channels',
        label: 'label',
        name: 'name',
        optional: true,
        type: 'select',
        value: 'C01234567',
      }

      expect(
        element(
          <ChannelsSelect
            name="name"
            label="label"
            initialChannel="C01234567"
          />
        )
      ).toStrictEqual(expectedElement)
    })
  })

  describe('<ConversationsSelect>', () => {
    it('outputs select element with conversations data source', () => {
      const expectedElement: DialogElement = {
        data_source: 'conversations',
        label: 'label',
        name: 'name',
        optional: true,
        type: 'select',
        value: 'D01234567',
      }

      expect(
        element(
          <ConversationsSelect
            name="name"
            label="label"
            initialConversation="D01234567"
          />
        )
      ).toStrictEqual(expectedElement)
    })
  })

  describe('<SelectFragment>', () => {
    it('outputs fragmented options for external select', () => {
      const expectedElement: Pick<DialogElement, 'options'> = {
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
          { label: 'C', value: 'c' },
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
      ).toStrictEqual(expectedElement)
    })

    it('outputs fragmented option groups for external select', () => {
      const expectedElement: Pick<DialogElement, 'option_groups'> = {
        option_groups: [
          {
            label: 'Group A',
            options: [
              { label: '1', value: 'one' },
              { label: '2', value: 'two' },
            ],
          },
          {
            label: 'Group B',
            options: [
              { label: '3', value: 'three' },
              { label: '4', value: 'four' },
            ],
          },
        ],
      }

      expect(
        JSXSlack(
          <SelectFragment>
            <Optgroup label="Group A">
              <Option value="one">1</Option>
              <Option value="two">2</Option>
            </Optgroup>
            <Optgroup label="Group B">
              <Option value="three">3</Option>
              <Option value="four">4</Option>
            </Optgroup>
          </SelectFragment>
        )
      ).toStrictEqual(expectedElement)
    })
  })
})

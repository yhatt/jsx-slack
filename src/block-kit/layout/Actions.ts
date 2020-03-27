/* eslint-disable @typescript-eslint/no-empty-function */
import { ActionsBlock, Action } from '@slack/types'
import { LayoutBlockProps } from './utils'
import { resolveTagName } from '../utils'
import { JSXSlack, createComponent } from '../../jsx'

interface ActionsProps extends LayoutBlockProps {
  children: JSXSlack.ChildElements
}

const actionTypeValidators = {
  button: () => {},
  channels_select: () => {},
  checkboxes: () => {},
  conversations_select: () => {},
  datepicker: () => {},
  external_select: () => {},
  overflow: () => {},
  radio_buttons: () => {},
  static_select: () => {},
  users_select: () => {},
} as const

export const Actions = createComponent<ActionsProps, ActionsBlock>(
  'Actions',
  (props) => {
    const elements = JSXSlack.Children.toArray(props.children).reduce(
      (reduced: Action[], child: any) => {
        if (typeof child === 'object' && typeof child.type === 'string') {
          const validator = actionTypeValidators[child.type]

          if (!validator) {
            const tag = resolveTagName(child)
            throw new Error(
              `<Actions> has detected an incompatible element in its children${
                tag ? `: ${tag}` : '.'
              }`
            )
          }

          validator(child)
          return [...reduced, child]
        }
        return reduced
      },
      []
    )

    if (elements.length > 25)
      throw new Error(
        `<Actions> can include up to 25 elements, but there are ${elements.length} elements.`
      )

    return {
      type: 'actions',
      block_id: props.blockId || props.id,
      elements,
    }
  }
)

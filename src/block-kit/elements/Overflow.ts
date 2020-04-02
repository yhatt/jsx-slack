import { Option, Overflow as OverflowElement } from '@slack/types'
import { ActionProps } from './utils'
import { ConfirmableProps } from '../composition/Confirm'
import { plainText } from '../composition/utils'
import { resolveTagName } from '../utils'
import { JSXSlack, createComponent } from '../../jsx'

export interface OverflowItemProps {
  children: JSXSlack.ChildElements
  url?: string
  value?: string
}

export interface OverflowProps extends ActionProps, ConfirmableProps {
  children: JSXSlack.ChildNodes
}

export const OverflowItem = createComponent<OverflowItemProps, Option>(
  'OverflowItem',
  ({ children, url, value }) => ({ text: plainText(children), url, value })
)

export const Overflow = createComponent<OverflowProps, OverflowElement>(
  'Overflow',
  (props) => {
    const options = JSXSlack.Children.toArray(props.children).filter(
      (option): option is Option => {
        if (!JSXSlack.isValidElement(option)) return false

        if (option.$$jsxslack.type !== OverflowItem) {
          const tag = resolveTagName(option)
          throw new Error(
            `<Overflow> must contain only <OverflowItem>${
              tag ? ` but it is included ${tag}` : ''
            }.`
          )
        }

        return true
      }
    )

    if (options.length < 1)
      throw new Error('<Overflow> must contain least of 1 <OverflowItem>.')

    if (options.length > 5)
      throw new Error(
        `<Overflow> must contain up to 5 <OverflowItem> elements but there are ${options.length} elements.`
      )

    return {
      type: 'overflow',
      action_id: props.actionId || props.name,
      options,
      confirm: props.confirm as any,
    }
  }
)

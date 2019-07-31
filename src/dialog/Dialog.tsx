/** @jsx JSXSlack.h */
import { Dialog as SlackDialog } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ArrayOutput, ObjectOutput } from '../utils'

export interface DialogProps {
  callbackId: string
  children: JSXSlack.Children<{}>
  state?: string
  submitLabel?: string
  title: string
  notifyOnCancel?: boolean
}

export const Dialog: JSXSlack.FC<DialogProps> = props => {
  let { submitLabel } = props
  let stateJSON

  // Parse elements
  const elements: SlackDialog['elements'] = []
  const parsed: any[] = JSXSlack(<ArrayOutput>{props.children}</ArrayOutput>)

  parsed.forEach(obj => {
    if (!obj) return

    switch (obj.type) {
      case 'text':
      case 'textarea':
      case 'select':
        elements.push(obj)
        break
      case 'submit':
        submitLabel = submitLabel || obj.value
        break
      case 'hidden':
        stateJSON = stateJSON || {}
        stateJSON[obj.name] = obj.value
        break
      default:
        throw new Error(`Unknown element type: ${obj.type}`)
    }
  })

  return (
    <ObjectOutput<SlackDialog>
      title={props.title}
      callback_id={props.callbackId}
      elements={elements}
      state={props.state || (stateJSON ? JSON.stringify(stateJSON) : undefined)}
      submit_label={submitLabel}
      notify_on_cancel={props.notifyOnCancel}
    />
  )
}

/** @jsx JSXSlack.h */
import { Dialog as SlackDialog } from '@slack/types'
import { JSXSlack } from '../jsx'
import { ArrayOutput, ObjectOutput } from '../utils'
import { DialogValidationError } from './error'

export interface DialogProps {
  callbackId: string
  children: JSXSlack.Children<{}>
  state?: string
  submitLabel?: string
  title: string
  notifyOnCancel?: boolean
}

interface DialogElementProps {
  hint?: string
  label: string
  name: string
  title?: string
}

export const validateElement = (props: DialogElementProps) => {
  if (props.label.length > 48)
    throw new DialogValidationError(
      `The label of element must be up to 48 characters but a string with ${props.label.length} characters was passed.`
    )

  if (props.name.length > 300)
    throw new DialogValidationError(
      `The name of element must be up to 300 characters but a string with ${props.name.length} characters was passed.`
    )

  // `title` prop is an alias to `hint` for HTML compatibility.
  const hint = props.hint || props.title

  if (hint && hint.length > 150) {
    throw new DialogValidationError(
      `A ${
        props.hint ? 'hint' : 'title'
      } string of element must be up to 150 characters but a string with ${
        hint.length
      } characters was passed.`
    )
  }

  return { hint }
}

export const Dialog: JSXSlack.FC<DialogProps> = props => {
  let { submitLabel } = props
  let stateJSON

  // Parse elements
  const elements: SlackDialog['elements'] = []
  const parsed: any[] = JSXSlack(<ArrayOutput>{props.children}</ArrayOutput>)

  parsed.forEach(obj => {
    if (typeof obj !== 'object')
      throw new DialogValidationError(
        '<Dialog> allows only including dialog components.'
      )

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
        throw new DialogValidationError(`Unknown element type: ${obj.type}`)
    }
  })

  const state =
    props.state || (stateJSON ? JSON.stringify(stateJSON) : undefined)

  // Validation
  if (props.title.length > 24)
    throw new DialogValidationError(
      `The title of dialog must be up to 24 characters but a string with ${props.title.length} characters was passed.`
    )

  if (props.callbackId.length > 255)
    throw new DialogValidationError(
      `The callback ID of dialog must be up to 255 characters but a string with ${props.callbackId.length} characters was passed.`
    )

  if (elements.length === 0)
    throw new DialogValidationError(
      'Dialog must have the least of one element.'
    )

  if (elements.length > 10)
    throw new DialogValidationError(
      `Up to 10 form elements are allowed in dialog but ${elements.length} elements were passed.`
    )

  if (state && state.length > 3000)
    throw new DialogValidationError(
      `A state string of dialog must be up to 3000 characters but a string with ${state.length} characters was passed.`
    )

  if (submitLabel && submitLabel.length > 24)
    throw new DialogValidationError(
      `The label of submit button must be up to 24 characters but a string with ${submitLabel.length} characters was passed.`
    )

  return (
    <ObjectOutput<SlackDialog>
      title={props.title}
      callback_id={props.callbackId}
      elements={elements}
      state={state}
      submit_label={submitLabel}
      notify_on_cancel={!!props.notifyOnCancel}
    />
  )
}

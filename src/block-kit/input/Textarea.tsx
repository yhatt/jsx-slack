/** @jsx JSXSlack.h */
import { InputBlock, PlainTextInput as SlackPlainTextInput } from '@slack/types'
import { PlainTextInput } from '../elements/PlainTextInput'
import { JSXSlack, cleanMeta, createComponent } from '../../jsx'
import { InputTextProps, wrapInInput } from '../layout/Input'
import { coerceToInteger } from '../../utils'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TextareaProps extends Omit<InputTextProps, 'type'> {}

export const Textarea = createComponent<TextareaProps, InputBlock>(
  'Textarea',
  (props): any =>
    wrapInInput(
      cleanMeta(
        <PlainTextInput
          actionId={props.actionId || props.name}
          initialValue={props.value}
          maxLength={coerceToInteger(props.maxLength)}
          minLength={coerceToInteger(props.minLength)}
          placeholder={props.placeholder}
          multiline={true}
        />
      ) as SlackPlainTextInput,
      props,
      Textarea
    )
)

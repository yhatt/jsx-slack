/** @jsx JSXSlack.h */
import { InputBlock, PlainTextInput as SlackPlainTextInput } from '@slack/types'
import { PlainTextInput } from '../elements/PlainTextInput'
import { JSXSlack, cleanMeta, createComponent } from '../../jsx'
import { InputTextProps, wrapInInput } from '../layout/Input'
import { coerceToInteger } from '../../utils'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TextareaProps extends Omit<InputTextProps, 'type'> {}

/**
 * The input component for rendering `input` layout block containing with
 * {@link https://api.slack.com/reference/block-kit/block-elements#input a plain-text input}
 * with multiline text.
 *
 * _This component is available only in `<Modal>` container._ It should place on
 * immidiate children of `<Modal>`.
 *
 * ```jsx
 * <Modal title="My App">
 *   <Textarea
 *     label="Tweet"
 *     actionId="tweet"
 *     placeholder="What’s happening?"
 *     maxLength={280}
 *     required
 *   />
 * </Modal>
 * ```
 */
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

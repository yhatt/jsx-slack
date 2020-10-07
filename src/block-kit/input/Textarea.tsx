/** @jsx createElementInternal */
import { InputBlock, PlainTextInput as SlackPlainTextInput } from '@slack/types'
import { cleanMeta, createComponent, createElementInternal } from '../../jsx'
import { coerceToInteger } from '../../utils'
import { PlainTextInput } from '../elements/PlainTextInput'
import { InputTextProps, wrapInInput } from '../layout/Input'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TextareaProps extends Omit<InputTextProps, 'type'> {}

/**
 * The input component for rendering `input` layout block containing
 * {@link https://api.slack.com/reference/block-kit/block-elements#input a plain-text input}
 * with multiline text.
 *
 * _This component is not available in `<Blocks>` container._ It should place on
 * immidiate children of `<Modal>` or `<Home>`.
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
 *
 * @return The partial JSON for `input` layout block with a multiline plain-text
 *   input
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

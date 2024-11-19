/** @jsx createElementInternal */
import type { InputBlock, FileInput as SlackFileInput } from '@slack/types'
import {
  cleanMeta,
  createComponent,
  createElementInternal,
} from '../../jsx-internals'
import {
  FileInput as FileInputElement,
  convertFileInputPropsToElementProps,
} from '../elements/FileInput'
import { wrapInInput, type InputFileProps } from '../layout/Input'

export interface FileInputProps extends Omit<InputFileProps, 'type'> {}

/**
 * The input component for rendering `input` layout block containing
 * [a file input element](https://api.slack.com/reference/block-kit/block-elements#file_input)
 *
 * It should place on immidiate children of container component <Modal>.
 *
 * ```jsx
 * <Modal title="My App">
 *   <FileInput
 *     label="Resume"
 *     actionId="resume"
 *     accept=".pdf,.doc,.docx"
 *   />
 * </Modal>
 * ```
 *
 * @return The partial JSON for `input` layout block with a file input element
 */
export const FileInput = createComponent<FileInputProps, InputBlock>(
  'FileInput',
  (props): any =>
    wrapInInput(
      cleanMeta(
        <FileInputElement
          actionId={props.actionId || props.name}
          {...convertFileInputPropsToElementProps(props)}
        />,
      ) as SlackFileInput,
      props,
      FileInput,
    ),
)

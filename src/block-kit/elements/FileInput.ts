import type { FileInput as SlackFileInput } from '@slack/types'
import { JSXSlackError } from '../../error'
import { createComponent } from '../../jsx-internals'
import { coerceToInteger, coerceToString } from '../../utils'
import type { FileInputProps as JSXSlackFileInputProps } from '../input/FileInput'

export interface FileInputProps {
  children?: never
  actionId?: string
  filetypes?: SlackFileInput['filetypes']
  maxFiles?: SlackFileInput['max_files']
}

// NOTE: <FileInput> with Slack interface is not public component
export const FileInput = createComponent<FileInputProps, SlackFileInput>(
  'FileInput',
  (props) => ({
    type: 'file_input',
    action_id: props.actionId,
    filetypes: props.filetypes,
    max_files: props.maxFiles,
  }),
)

export const convertFileInputPropsToElementProps = (
  props: Pick<JSXSlackFileInputProps, 'accept' | 'multiple'>,
) => {
  const { accept, multiple } = props

  const filetypeSet = new Set(
    ([] as string[]).concat(accept ?? []).flatMap((t) => {
      const ts = coerceToString(t)
      if (typeof ts !== 'string') return []

      return ts.split(',').map((ext) => {
        const trimmed = ext.trim()

        if (trimmed.includes('/')) {
          throw new JSXSlackError(
            `The file input element accepts only file extensions, but got MIME type "${trimmed}" in "accept" prop.`,
            props['__source'],
          )
        }

        // Remove leading dot
        if (trimmed.startsWith('.')) return trimmed.slice(1)

        return trimmed
      })
    }),
  )

  const maxFiles = (() => {
    if (multiple === true) return undefined // Rely on Slack's default
    if (multiple === false) return 1

    const multipleNumber = coerceToInteger(multiple)
    if (typeof multipleNumber === 'number') return multipleNumber

    return 1
  })()

  return {
    filetypes: filetypeSet.size > 0 ? [...filetypeSet.values()] : undefined,
    maxFiles,
  } as const
}

export interface ActionProps {
  /** A unique identifier for the action triggering from this element. */
  actionId?: string

  /** A HTML-compatible alias into `actionId` prop. */
  name?: string
}

export interface AutoFocusibleProps {
  /**
   * Set whether the element will be set the focus automatically within the
   * containers that are for the view object, like `<Modal>` and `<Home>`.
   *
   * It can enable to only one element in the same container.
   */
  autoFocus?: boolean
}

export interface AutoFocusibleIntrinsicProps {
  /** An alias to `autofocus` attribute. */
  autofocus?: boolean
}

export interface SingleSelectableProps {
  /**
   * A boolean value whether provide
   * [the selectable menu from multiple options](https://api.slack.com/reference/block-kit/block-elements#multi_select).
   *
   * @remarks
   * *The multi-select menu cannot place in `<Actions>`.* jsx-slack throws an
   * error if you're trying to use `multiple` attribute in the children of
   * `<Actions>`.
   */
  multiple?: false
}

export interface MultiSelectableProps {
  multiple: true

  /**
   * Set the maximum number of items to allow selected in the multi select menu.
   *
   * This prop is only working in the multi select menu that is enabled
   * `multiple` attribute.
   */
  maxSelectedItems?: number
}

export interface ResponsableUrlProps {
  /**
   * A boolean value whether including extra `response_urls` field to the
   * `view_submission` event callback, for responding into the selected channel
   * via unique URL entrypoint.
   *
   * In short, turning on means providing an easy way to respond into selected.
   *
   * @remarks
   * _This prop is only available in the input component, and cannot coexist
   * with enabled `multiple` prop._
   */
  responseUrlEnabled?: boolean
}

export type MultiSelectablePropsFrom<
  T extends object,
  O extends string = never,
> = Omit<T, 'multiple' | O> & MultiSelectableProps

export const focusOnLoadFromProps = (
  props: AutoFocusibleProps & AutoFocusibleIntrinsicProps,
): boolean | undefined => {
  if (props.autoFocus !== undefined) {
    return !!props.autoFocus
  } else if (props.autofocus !== undefined) {
    return !!props.autofocus
  }
  return undefined
}

export interface ActionProps {
  /** A unique identifier for the action triggering from this element. */
  actionId?: string

  /** A HTML-compatible alias into `actionId` prop. */
  name?: string
}

export interface SingleSelectableProps {
  /**
   * A boolean value whether provide
   * {@link https://api.slack.com/reference/block-kit/block-elements#multi_select the selectable menu from multiple options}.
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
  responseUrlEnabled?: boolean
}

export type MultiSelectablePropsFrom<
  T extends object,
  O extends string = never
> = Omit<T, 'multiple' | O> & MultiSelectableProps

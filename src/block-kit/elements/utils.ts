export interface ActionProps {
  /** A unique identifier for the action triggering from this element. */
  actionId?: string

  /** An alias to `actionId` prop. */
  name?: string
}

export interface SingleSelectableProps {
  multiple?: false
}

export interface MultiSelectableProps {
  maxSelectedItems?: number
  multiple: true
}

export interface ResponsableUrlProps {
  responseUrlEnabled?: boolean
}

export type MultiSelectablePropsFrom<
  T extends object,
  O extends string = never
> = Omit<T, 'multiple' | O> & MultiSelectableProps

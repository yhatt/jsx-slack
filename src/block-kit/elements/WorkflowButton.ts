import { WorkflowButton as WorkflowButtonElement } from '@slack/types'
import { JSXSlack } from '../../jsx'
import { createComponent } from '../../jsx-internals'
import { plainText } from '../composition/utils'
import { ActionProps } from './utils'

export interface WorkflowButtonProps extends ActionProps {
  children: JSXSlack.ChildElements

  /**
   * A string label for setting an accessible name of the button. This label
   * will be read out by screen readers instead of the text content of the
   * button. It must up to 75 characters.
   */
  accessibilityLabel?: string

  /**
   * An alias to `accessibilityLabel` prop that is compatible with WAI-ARIA.
   */
  'aria-label'?: string

  /**
   * Select the color scheme of the button from `primary` (Green button) and
   * `danger` (Red button). If not defined, the button won't be colored.
   */
  style?: 'danger' | 'primary'

  /**
   * An external URL to load when clicked button.
   *
   * You still have to send an acknowledge response for Slack's event callback
   * even if setting URL to button.
   */
  workflow: WorkflowButtonElement['workflow']
}

/**
 * The interactive component for
 * [the `workflow_button` element](https://api.slack.com/reference/block-kit/block-elements#workflow_button).
 *
 * It can run [a link trigger](https://api.slack.com/automation/triggers/link#workflow_buttons) with customizable
 * inputs. You should set the plain-text label for the button in its children.
 *
 * @example
 * ```jsx
 * <Blocks>
 *   <Actions>
 *     <WorkflowButton
 *       actionId="action"
 *       value="value"
 *       style="primary"
 *       workflow={{
 *         trigger: {
 *           url: "https://slack.com/shortcuts/Ft0123ABC456/321...zyx",
 *           customizable_input_parameters: [
 *             {
 *               name: "input_parameter_a",
 *               value: "Value for input param A"
 *             },
 *             {
 *               name: "input_parameter_b",
 *               value: "Value for input param B"
 *             }
 *           ]
 *         }
 *       }}
 *     >
 *       Run Workflow
 *     </Button>
 *   </Actions>
 * </Blocks>
 * ```
 *
 * @return The partial JSON of a block element for button
 */
export const WorkflowButton = createComponent<
  WorkflowButtonProps,
  WorkflowButtonElement
>('WorkflowButton', (props) => {
  return {
    type: 'workflow_button',
    action_id: props.actionId || props.name,
    accessibility_label: props.accessibilityLabel ?? props['aria-label'],
    text: plainText(props.children),
    style: props.style,
    workflow: props.workflow,
  }
})

/** @deprecated Classic dialog support was deprecated in favor of Slack Modals and will remove in v1. Modal's constraint is not so much stricter as dialog so we don't provide an error object for the modal now. */
export class DialogValidationError extends Error {
  public constructor(message?: string) {
    super(message)
    this.name = 'DialogValidationError'
  }
}

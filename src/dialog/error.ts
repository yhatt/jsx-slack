export class DialogValidationError extends Error {
  public constructor(message?: string) {
    super(message)
    this.name = 'DialogValidationError'
  }
}

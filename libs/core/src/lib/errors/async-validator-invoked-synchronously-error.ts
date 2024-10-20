export class AsyncValidatorInvokedSynchronouslyError extends Error {
  constructor() {
    super(`Validator contains asynchronous validations but was invoked synchronously. Please call 'validateAsync' rather than 'validate'.`);
    this.name = 'AsyncValidatorInvokedSynchronouslyError';
  }
}

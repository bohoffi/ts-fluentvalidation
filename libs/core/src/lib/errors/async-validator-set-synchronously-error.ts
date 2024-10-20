export class AsyncValidatorSetSynchronouslyError extends Error {
  constructor() {
    super(
      `Validator contains asynchronous validations but was set synchronously. Please call 'setValidatorAsync' rather than 'setValidator'.`
    );
    this.name = 'AsyncValidatorSetSynchronouslyError';
  }
}

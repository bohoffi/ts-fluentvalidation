export class AsyncValidatorSetSynchronouslyError extends Error {
  constructor(propertyName?: string) {
    super(
      propertyName
        ? `Validator for property '${propertyName}' contains asynchronous rules but was set synchronously. Please call 'setValidatorAsync' rather than 'setValidator'.`
        : `Validator contains asynchronous rules but was set synchronously. Please call 'setValidatorAsync' rather than 'setValidator'.`
    );
    this.name = 'AsyncValidatorSetSynchronouslyError';
  }
}

export class AsyncValidatorInvokedSynchronouslyError extends Error {
  constructor(propertyName?: string) {
    super(
      propertyName
        ? `Validator for property '${propertyName}' contains asynchronous validations but was invoked synchronously. Please call 'validateAsync' rather than 'validate'.`
        : `Validator contains asynchronous validations but was invoked synchronously. Please call 'validateAsync' rather than 'validate'.`
    );
    this.name = 'AsyncValidatorInvokedSynchronouslyError';
  }
}

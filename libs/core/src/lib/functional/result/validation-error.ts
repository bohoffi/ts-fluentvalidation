import { ValidationFailure } from './validation-failure';

export class ValidationError extends Error {
  constructor(public readonly failure: ValidationFailure) {
    super(failure.message);
    this.name = 'ValidationError';
  }
}

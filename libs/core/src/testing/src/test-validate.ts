import { AbstractValidator } from '../../lib/abstract-validator';
import { ValidationContext } from '../../lib/validation-context';
import { TestValidationResult } from './test-validation-result';

/**
 * Validates an instance of an object using the specified validator.
 *
 * @typeParam T - The type of the object being validated.
 * @param validator - The validator to use for validation.
 * @param instance - The instance of the object to validate.
 * @returns The result of the validation.
 */
export function testValidate<T extends object>(validator: AbstractValidator<T>, instance: T): TestValidationResult<T>;
/**
 * Validates an object using the specified validator and validation context.
 * @typeParam T - The type of the object being validated.
 * @param validator - The validator to use for validation.
 * @param validationContext - The validation context containing the object to validate.
 * @returns The result of the validation.
 */
export function testValidate<T extends object>(
  validator: AbstractValidator<T>,
  validationContext: ValidationContext<T>
): TestValidationResult<T>;
export function testValidate<T extends object>(validator: AbstractValidator<T>, instanceOrValidationContext: T): TestValidationResult<T> {
  const validationResult = validator.validate(instanceOrValidationContext);
  return new TestValidationResult<T>(validationResult);
}

/**
 * Validates an instance of an object using the specified validator.
 *
 * @typeParam T - The type of the object being validated.
 * @param validator - The validator to use for validation.
 * @param instance - The instance of the object to validate.
 * @returns The result of the validation.
 */
export async function testValidateAsync<T extends object>(validator: AbstractValidator<T>, instance: T): Promise<TestValidationResult<T>>;
/**
 * Validates an object using the specified validator and validation context.
 * @typeParam T - The type of the object being validated.
 * @param validator - The validator to use for validation.
 * @param validationContext - The validation context containing the object to validate.
 * @returns The result of the validation.
 */
export async function testValidateAsync<T extends object>(
  validator: AbstractValidator<T>,
  validationContext: ValidationContext<T>
): Promise<TestValidationResult<T>>;
export async function testValidateAsync<T extends object>(
  validator: AbstractValidator<T>,
  instanceOrValidationContext: T
): Promise<TestValidationResult<T>> {
  const validationResult = await validator.validateAsync(instanceOrValidationContext);
  return new TestValidationResult<T>(validationResult);
}

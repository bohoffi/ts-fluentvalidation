import { Validator, ValidatorConfig } from '../../lib/types';
import { TestValidationResult } from './test-validation-result';

/**
 * Validates an instance of an object using the specified validator.
 *
 * @typeParam T - The type of the object being validated.
 * @param validator - The validator to use for validation.
 * @param model - The model to validate.
 * @returns The result of the validation.
 */
export function testValidate<T extends object>(validator: Validator<T>, model: T): TestValidationResult<T>;
/**
 * Validates an instance of an object using the specified validator and strategy.
 *
 * @typeParam T - The type of the object being validated.
 * @param validator - The validator to use for validation.
 * @param model - The model to validate.
 * @param config - The configuration to apply.
 */
export function testValidate<T extends object>(
  validator: Validator<T>,
  model: T,
  config: (config: ValidatorConfig<T>) => void
): TestValidationResult<T>;
export function testValidate<T extends object>(
  validator: Validator<T>,
  model: T,
  config?: (config: ValidatorConfig<T>) => void
): TestValidationResult<T> {
  const validationResult = config ? validator.validate(model, config) : validator.validate(model);
  return new TestValidationResult<T>(validationResult);
}

/**
 * Validates an instance of an object using the specified validator.
 *
 * @typeParam T - The type of the object being validated.
 * @param validator - The validator to use for validation.
 * @param model - The model to validate.
 * @returns The result of the validation.
 */
export async function testValidateAsync<T extends object>(validator: Validator<T>, model: T): Promise<TestValidationResult<T>>;
/**
 * Validates an instance of an object using the specified validator and strategy.
 *
 * @typeParam T - The type of the object being validated.
 * @param validator - The validator to use for validation.
 * @param model - The model to validate.
 * @param config - The configuration to apply.
 */
export async function testValidateAsync<T extends object>(
  validator: Validator<T>,
  model: T,
  config: (config: ValidatorConfig<T>) => void
): Promise<TestValidationResult<T>>;
export async function testValidateAsync<T extends object>(
  validator: Validator<T>,
  model: T,
  config?: (config: ValidatorConfig<T>) => void
): Promise<TestValidationResult<T>> {
  const validationResult = config ? await validator.validateAsync(model, config) : await validator.validateAsync(model);
  return new TestValidationResult<T>(validationResult);
}

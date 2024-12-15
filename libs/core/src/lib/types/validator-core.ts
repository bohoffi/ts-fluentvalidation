import { ValidationResult } from '../result';
import { ValidationContext } from '../validation-context';
import { ValidatorConfig } from './types';

/**
 * Represents the core functionality of a validator.
 */
export interface ValidatorCore<TModel extends object> {
  /**
   * Validates the given model against the validations respecting the passed configuration.
   *
   * @param model - The model to validate.
   * @param config - The configuration to apply.
   * @returns The validation result.
   * @throws {ValidationError} if the validator is configured to throw and any failures occur.
   */
  validate(model: TModel, config?: (config: ValidatorConfig<TModel>) => void): ValidationResult;

  /**
   * Validates the given validation context against the validations respecting the passed configuration.
   *
   * @param validationContext - The validation context to validate.
   * @param config - The configuration to apply.
   * @returns The validation result.
   * @throws {ValidationError} if the validator is configured to throw and any failures occur.
   */
  validate(validationContext: ValidationContext<TModel>, config?: (config: ValidatorConfig<TModel>) => void): ValidationResult;

  /**
   * Validates the given model asynchonously against the validations respecting the passed configuration.
   *
   * @param model - The model to validate.
   * @param config - The configuration to apply.
   * @returns The validation result.
   * @throws {ValidationError} if the validator is configured to throw and any failures occur.
   */
  validateAsync(model: TModel, config?: (config: ValidatorConfig<TModel>) => void): Promise<ValidationResult>;

  /**
   * Validates the given validation context asynchonously against the validations respecting the passed configuration.
   *
   * @param validationContext - The validation context to validate.
   * @param config - The configuration to apply.
   * @returns The validation result.
   * @throws {ValidationError} if the validator is configured to throw and any failures occur.
   */
  validateAsync(
    validationContext: ValidationContext<TModel>,
    config?: (config: ValidatorConfig<TModel>) => void
  ): Promise<ValidationResult>;

  /**
   * Validates the given model against the validations and throws a ValidationError if any failures occur.
   *
   * @param model - The model to validate.
   * @returns The validation result.
   * @throws {ValidationError} if any failures occur.
   */
  validateAndThrow(model: TModel): ValidationResult;

  /**
   * Validates the given model asynchronously against the validations and throws a ValidationError if any failures occur.
   *
   * @param model - The model to validate.
   * @returns The validation result.
   * @throws {ValidationError} if any failures occur.
   */
  validateAndThrowAsync(model: TModel): Promise<ValidationResult>;
}

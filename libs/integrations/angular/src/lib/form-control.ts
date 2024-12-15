import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CascadeMode, InferValidations, KeyOf, ValidationResult, Validator } from '@ts-fluentvalidation/core';

/**
 * Converts a `@ts-fluentvalidation/core` property validation to an Angular validator function.
 *
 * @example
 * ```typescript
 * const personValidator = createValidator<Person>()
 *  .ruleFor('firstName', equals('John'));
 *
 * const firstNameValidatorFn = toValidatorFn(personValidator, 'firstName');
 *
 * const control = new FormControl<string>('Jane', firstNameValidatorFn);
 *
 * console.log(control.errors); // { firstName: [`'firstName' must equal John.`] }
 * ```
 *
 * @param validator The `@ts-fluentvalidation/core` validator to create the validator function from.
 * @param validationKey The key of the validation to transform.
 * @param cascadeMode Determines if all validations should be processed. Defaults to `Continue`.
 * @returns Angular validator function
 * @throws {AsyncValidatorInvokedSynchronouslyError} if the validator contains asynchronous validations or conditions but was invoked synchronously.
 */
export function toValidatorFn<T extends object, V extends InferValidations<Validator<T>>, K extends KeyOf<V> & KeyOf<T>>(
  validator: Validator<T, V>,
  validationKey: K,
  cascadeMode: CascadeMode = 'Continue'
): ValidatorFn {
  return (control: AbstractControl<T[K]>): ValidationErrors | null => {
    if (isEmptyInputValue(control.value)) {
      return null;
    }

    const result = validator.validate(
      {
        [validationKey]: control.value
      } as T,
      config => {
        config.includeProperties = validationKey;
        config.propertyCascadeMode = cascadeMode;
      }
    );
    return toControlErrors(result, validationKey);
  };
}

/**
 * Converts a `@ts-fluentvalidation/core` property validation to an Angular async validator function.
 *
 * @example
 * ```typescript
 * const personValidator = createValidator<Person>()
 * .ruleFor('firstName', equals('John'));
 *
 * const firstNameAsyncValidatorFn = toAsyncValidatorFn(personValidator, 'firstName');
 *
 * const control = new FormControl<string>('Jane', {
 *   asyncValidators: firstNameAsyncValidatorFn
 * });
 *
 * console.log(control.errors); // { firstName: [`'firstName' must equal John.`] }
 * ```
 *
 * @param validator The `@ts-fluentvalidation/core` validator to create the async validator function from.
 * @param validationKey The key of the validation to transform.
 * @param cascadeMode Determines if all validations should be processed. Defaults to `Continue`.
 * @returns Angular async validator function
 */
export function toAsyncValidatorFn<T extends object, V extends InferValidations<Validator<T>>, K extends KeyOf<V> & KeyOf<T>>(
  validator: Validator<T, V>,
  validationKey: K,
  cascadeMode: CascadeMode = 'Continue'
): AsyncValidatorFn {
  return async (control: AbstractControl<T[K]>): Promise<ValidationErrors | null> => {
    if (isEmptyInputValue(control.value)) {
      return null;
    }

    const result = await validator.validateAsync(
      {
        [validationKey]: control.value
      } as T,
      config => {
        config.includeProperties = validationKey;
        config.propertyCascadeMode = cascadeMode;
      }
    );
    return toControlErrors(result, validationKey);
  };
}

/**
 * Function as used by Angular validators to check if a value is empty.
 */
function isEmptyInputValue(value: unknown): boolean {
  return value == null || ((typeof value === 'string' || Array.isArray(value)) && value.length === 0);
}

/**
 * Converts the validation result to Angular validation errors.
 *
 * @param validationResult Validation result to convert.
 * @param propertyName Name of the property to extract the errors for.
 * @returns Angular validation errors.
 */
function toControlErrors(validationResult: ValidationResult, propertyName: string): ValidationErrors | null {
  return validationResult.isValid
    ? null
    : validationResult.failures
        .filter(failure => failure.propertyName === propertyName && failure.errorCode)
        .reduce<ValidationErrors>((acc, { errorCode, message }) => {
          acc[errorCode!] = message;
          return acc;
        }, {});
}

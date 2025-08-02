import { AsyncValidatorSetSynchronouslyError } from '../../errors';
import { ComplexProperty } from '../../types/properties';
import { KeyOf, Nullish } from '../../types/ts-helpers';
import { SyncValidatorValidation, Validation } from '../../types/validations';
import { Validator } from '../../types/validator';
import { createValidation } from '../create-validation';

/**
 * Creates a validation function that checks if the value is valid according to the given validator.
 *
 * @param validator The validator to use.
 */
export function setValidator<TValue extends ComplexProperty, TModel extends object>(
  validator: Validator<NonNullable<TValue>>
): SyncValidatorValidation<Nullish<TValue>, TModel> {
  if (
    Object.entries<Validation<TModel[KeyOf<TModel>], TModel>[]>(validator.validations)
      .flatMap(([, validations]) => validations)
      .some(validation => validation.metadata.isAsync || validation.metadata.asyncCondition !== undefined)
  ) {
    throw new AsyncValidatorSetSynchronouslyError();
  }

  const validatorValidation = createValidation<Nullish<TValue>, TModel>(
    value => (value == null ? true : validator.validate(value).isValid),
    {
      errorCode: setValidator.name
    }
  ) as unknown as SyncValidatorValidation<Nullish<TValue>, TModel>;
  validatorValidation.validator = validator;
  return validatorValidation;
}

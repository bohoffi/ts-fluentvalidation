import { ComplexProperty } from '../../types/properties';
import { Nullish } from '../../types/ts-helpers';
import { AsyncValidatorValidation, Validator } from '../../types/types';
import { createAsyncValidation } from '../create-validation-fn';

/**
 * Creates an asynchronous validation function that checks if the value is valid according to the given validator.
 *
 * @param validator The validator to use.
 */
export function setValidatorAsync<TValue extends ComplexProperty, TModel>(
  validator: Validator<NonNullable<TValue>>
): AsyncValidatorValidation<Nullish<TValue>, TModel> {
  const validatorValidation = createAsyncValidation<Nullish<TValue>, TModel>(
    async value => {
      if (value == null) {
        return Promise.resolve(true);
      }
      return (await validator.validateAsync(value)).isValid;
    },
    {
      errorCode: setValidatorAsync.name
    }
  ) as unknown as AsyncValidatorValidation<Nullish<TValue>, TModel>;
  validatorValidation.validator = validator;
  return validatorValidation;
}

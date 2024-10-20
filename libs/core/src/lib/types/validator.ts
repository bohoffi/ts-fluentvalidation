import { ValidationResult } from '../result';
import { ValidationContext } from '../validation-context';
import { ArrayKeyOf, EmptyObject, InferArrayElement, KeyOf } from './ts-helpers';
import { CascadeMode } from './types';
import { Validation } from './validations';
import { ValidatorCore } from './validator-core';

/**
 * Utility type for extracting the validations from a validator.
 *
 * @param T - The type to extract the validations from if it is a Validator type.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type InferValidations<T> = T extends Validator<infer TModel, infer Validations> ? Validations : EmptyObject;

/**
 * Represents a validator.
 *
 * @template TModel - The type of the model to validate.
 * @template ModelValidations - The type of the validations for the model.
 */
export interface Validator<TModel extends object, ModelValidations extends object = EmptyObject> extends ValidatorCore<TModel> {
  /**
   * The validations for the validator.
   */
  readonly validations: ModelValidations;

  /**
   * Adds one or more validations for the given key.
   *
   * @param key - The key to validate.
   * @param validations - Validations to add.
   */
  ruleFor<Key extends KeyOf<TModel>>(
    key: Key,
    ...validations: Validation<TModel[Key], TModel>[]
  ): Validator<TModel, ModelValidations & { [P in Key]: Validation<TModel[Key], TModel>[] }>;

  /**
   * Adds one or more validations for the given key optionally preceded with the specified cascade mode.
   *
   * @param key - The key to validate.
   * @param cascadeModeAndValidations - Validations to add optionally preceded by the cascade mode for the given key.
   */
  ruleFor<Key extends KeyOf<TModel>>(
    key: Key,
    ...cascadeModeAndValidations: [CascadeMode, ...Validation<TModel[Key], TModel>[]]
  ): Validator<TModel, ModelValidations & { [P in Key]: Validation<TModel[Key], TModel>[] }>;

  /**
   * Adds one or more array validations for the given key.
   *
   * @param key - The key to validate.
   * @param validations - Validations to add.
   */
  ruleForEach<Key extends ArrayKeyOf<TModel>>(
    key: Key,
    ...validations: Validation<InferArrayElement<TModel[Key]>, TModel>[]
  ): Validator<TModel, ModelValidations & { [P in Key]: Validation<InferArrayElement<TModel[Key]>, TModel>[] }>;

  /**
   * Adds one or more array validations for the given key optionally preceded with the specified cascade mode.
   *
   * @param key - The key to validate.
   * @param cascadeModeAndValidations - Validations to add optionally preceded by the cascade mode for the given key.
   */
  ruleForEach<Key extends ArrayKeyOf<TModel>>(
    key: Key,
    ...cascadeModeAndValidations: [CascadeMode, ...Validation<InferArrayElement<TModel[Key]>, TModel>[]]
  ): Validator<TModel, ModelValidations & { [P in Key]: Validation<InferArrayElement<TModel[Key]>, TModel>[] }>;

  /**
   * Includes the validations from the given validator.
   *
   * @remarks Neither the `cascadeMode` will be included nor the conditions applied to preceding validations.
   *
   * @param validator - The validator to include.
   */
  include<TIncludeModel extends TModel, IncludeValidations extends object = InferValidations<Validator<TIncludeModel>>>(
    validator: Validator<TIncludeModel, IncludeValidations>
  ): Validator<TModel & TIncludeModel, ModelValidations & IncludeValidations>;

  /**
   * Sets a function which is executed before the actual validation process.
   * If this function returns `false`, the validation process will be skipped.
   * It allows to add custom validation failures before the actual validation process.
   *
   * @param preValidation - The function to execute before the actual validation process.
   */
  preValidate(
    preValidation: (validationContext: ValidationContext<TModel>, validationResult: ValidationResult) => boolean
  ): Validator<TModel, ModelValidations>;
}

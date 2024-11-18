import { ValidationResult } from '../result';
import { ValidationContext } from '../validation-context';
import { ArrayKeyOf, EmptyObject, InferArrayElement, KeyOf } from './ts-helpers';
import { CascadeMode } from './types';
import { AsyncValidationPredicate, Validation, ValidationPredicate } from './validations';
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
  ): Validator<TModel, ModelValidations & Record<Key, Validation<TModel[Key], TModel>[]>>;

  /**
   * Adds one or more validations for the given key optionally preceded with the specified cascade mode.
   *
   * @param key - The key to validate.
   * @param cascadeModeAndValidations - Validations to add optionally preceded by the cascade mode for the given key.
   */
  ruleFor<Key extends KeyOf<TModel>>(
    key: Key,
    ...cascadeModeAndValidations: [CascadeMode, ...Validation<TModel[Key], TModel>[]]
  ): Validator<TModel, ModelValidations & Record<Key, Validation<TModel[Key], TModel>[]>>;

  /**
   * Adds one or more array validations for the given key.
   *
   * @param key - The key to validate.
   * @param validations - Validations to add.
   */
  ruleForEach<Key extends ArrayKeyOf<TModel>>(
    key: Key,
    ...validations: Validation<InferArrayElement<TModel[Key]>, TModel>[]
  ): Validator<TModel, ModelValidations & Record<Key, Validation<InferArrayElement<TModel[Key]>, TModel>[]>>;

  /**
   * Adds one or more array validations for the given key optionally preceded with the specified cascade mode.
   *
   * @param key - The key to validate.
   * @param cascadeModeAndValidations - Validations to add optionally preceded by the cascade mode for the given key.
   */
  ruleForEach<Key extends ArrayKeyOf<TModel>>(
    key: Key,
    ...cascadeModeAndValidations: [CascadeMode, ...Validation<InferArrayElement<TModel[Key]>, TModel>[]]
  ): Validator<TModel, ModelValidations & Record<Key, Validation<InferArrayElement<TModel[Key]>, TModel>[]>>;

  /**
   * Includes the validations from the given validator.
   *
   * @remarks `CascadeMode` will be set from `ValidatorConfig` or the default (`Continue`) and conditions won't be applied to preceding validations.
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

  /**
   * Defines a `when` condition for several rules.
   *
   * @param predicate - The condition to check.
   * @param callback - The callback to define conditional rules.
   */
  when<TConditionalModel extends TModel = TModel, ConditionalValidations extends object = InferValidations<Validator<TConditionalModel>>>(
    predicate: ValidationPredicate<TModel>,
    callback: (
      validator: Validator<TModel, ModelValidations>
    ) => Validator<TModel & TConditionalModel, ModelValidations & ConditionalValidations>
  ): OtherwisableValidator<TModel & TConditionalModel, ModelValidations & ConditionalValidations>;

  /**
   * Defines an async `when` condition for several rules.
   *
   * @param predicate - The condition to check.
   * @param callback - The callback to define conditional rules.
   */
  whenAsync<
    TConditionalModel extends TModel = TModel,
    ConditionalValidations extends object = InferValidations<Validator<TConditionalModel>>
  >(
    predicate: AsyncValidationPredicate<TModel>,
    callback: (
      validator: Validator<TModel, ModelValidations>
    ) => Validator<TModel & TConditionalModel, ModelValidations & ConditionalValidations>
  ): OtherwisableValidator<TModel & TConditionalModel, ModelValidations & ConditionalValidations>;

  /**
   * Defines an `unless` condition for several rules.
   *
   * @param predicate - The condition to check.
   * @param callback - The callback to define conditional rules.
   */
  unless<TConditionalModel extends TModel = TModel, ConditionalValidations extends object = InferValidations<Validator<TConditionalModel>>>(
    predicate: ValidationPredicate<TModel>,
    callback: (
      validator: Validator<TModel, ModelValidations>
    ) => Validator<TModel & TConditionalModel, ModelValidations & ConditionalValidations>
  ): OtherwisableValidator<TModel & TConditionalModel, ModelValidations & ConditionalValidations>;

  /**
   * Defines an async `unless` condition for several rules.
   *
   * @param predicate - The condition to check.
   * @param callback - The callback to define conditional rules.
   */
  unlessAsync<
    TConditionalModel extends TModel = TModel,
    ConditionalValidations extends object = InferValidations<Validator<TConditionalModel>>
  >(
    predicate: AsyncValidationPredicate<TModel>,
    callback: (
      validator: Validator<TModel, ModelValidations>
    ) => Validator<TModel & TConditionalModel, ModelValidations & ConditionalValidations>
  ): OtherwisableValidator<TModel & TConditionalModel, ModelValidations & ConditionalValidations>;
}

/**
 * Represents a validator created by using `when`/`unless` which offers an `otherwise` function.
 *
 * @template TModel - The type of the model to validate.
 * @template ModelValidations - The type of the validations for the model.
 *
 * @template TOtherwiseModel - The type of the model to validate when the condition is not met.
 * @template OtherwiseValidations - The type of the validations for the model when the condition is not met.
 *
 * @see {@link Validator}
 */
export interface OtherwisableValidator<TModel extends object, ModelValidations extends object = EmptyObject>
  extends Validator<TModel, ModelValidations> {
  otherwise<TOtherwiseModel extends TModel = TModel, OtherwiseValidations extends object = InferValidations<Validator<TOtherwiseModel>>>(
    callback: (
      validator: Validator<TModel, ModelValidations>
    ) => Validator<TModel & TOtherwiseModel, ModelValidations & OtherwiseValidations>
  ): Validator<TModel & TOtherwiseModel, ModelValidations & OtherwiseValidations>;
}

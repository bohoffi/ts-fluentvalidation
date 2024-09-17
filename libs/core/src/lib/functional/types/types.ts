import { KeyOf, Prettify, RequiredByKeys } from './ts-helpers';

type ValidationFnMetadata<TModel> = {
  when?: (model: TModel) => boolean;
  whenApplyTo?: ApplyConditionTo;
  unless?: (model: TModel) => boolean;
  unlessApplyTo?: ApplyConditionTo;
};

/**
 * Represents a validation function.
 */
export type ValidationFn<TValue = unknown, TModel = unknown> = {
  /**
   * The validation function that takes a value of type TValue and returns a boolean indicating whether the value is valid.
   */
  (value: TValue): boolean;
  /**
   * The message to use when the validation fails.
   */
  message?: string;
  /**
   * The metadata for the validation function.
   */
  metadata: ValidationFnMetadata<TModel>;
  /**
   * Adds a when condition to the validation function.
   *
   * @param when - The condition to apply.
   * @param applyTo - The target to which the condition should be applied.
   * @returns A new validation function with the condition applied.
   */
  when(predicate: (model: TModel) => boolean, applyTo?: ApplyConditionTo): ValidationFn<TValue, TModel>;
  /**
   * Adds an unless condition to the validation function.
   *
   * @param unless - The condition to apply.
   * @param applyTo - The target to which the condition should be applied.
   * @returns A new validation function with the condition applied.
   */
  unless(predicate: (model: TModel) => boolean, applyTo?: ApplyConditionTo): ValidationFn<TValue, TModel>;
};

type ValidationFnArray<TModel extends object, Key extends KeyOf<TModel>> = ReadonlyArray<ValidationFn<TModel[Key], TModel>>;

export type ValidationsDictionary<TModel extends object> = Record<string, ValidationFnArray<TModel, KeyOf<TModel>>>;

type ValidationsDictionaryInput<TModel extends object, Key extends KeyOf<TModel>> = Prettify<{
  [P in Key]: ValidationFnArray<TModel, Key>;
  // TODO use ConcatArray instead of ReadonlyArray?
  // [P in Key]: ConcatArray<ValidationFn<TModel[Key], TModel>>;
}>;

/**
 * Represents the merged validations for a given key.
 */
export type MergedValidations<
  TModel extends object,
  Key extends KeyOf<TModel>,
  ValidationsInput extends ValidationsDictionary<TModel>
> = Prettify<Readonly<ValidationsInput & ValidationsDictionaryInput<TModel, Key>>>;

/**
 * Represents the cascade mode for validation.
 * - 'Continue': Allows validation to continue even if a previous validation fails.
 * - 'Stop': Stops validation if a previous validation fails.
 *
 * **Note:** The default cascade mode is 'Continue'.
 */
export type CascadeMode = 'Continue' | 'Stop';

/**
 * Specifies the target to which a condition should be applied.
 * - `'AllValidators'`: The condition should be applied to all preceding validators.
 * - `'CurrentValidator'`: The condition should be applied to the current validator only.
 *
 * **Note:** The default value is `'AllValidators'`.
 */
export type ApplyConditionTo = 'AllValidators' | 'CurrentValidator';

/**
 * Configuration for the validator.
 */
export type ValidatorConfig<TModel extends object> = {
  /**
   * If true, the validator will throw a ValidationError if any failures occur.
   */
  throwOnFailures?: boolean;
  /**
   * The properties to include in the validation.
   */
  includeProperties?: KeyOf<TModel>[];
  /**
   * The cascade mode on validator level.
   */
  cascadeMode?: CascadeMode;
};

/**
 * Represents the configuration for validation with `cascadeMode` being required.
 */
export type ValidateConfig<TModel extends object> = RequiredByKeys<ValidatorConfig<TModel>, 'cascadeMode'>;

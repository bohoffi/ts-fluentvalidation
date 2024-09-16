import { KeyOf, Prettify, RequiredByKeys } from './ts-helpers';

/**
 * Represents a validation function.
 */
export type ValidationFn<TValue = unknown> = {
  (value: TValue): boolean;
  message?: string;
};

export type ValidationsDictionary<TModel extends object> = Record<string, ReadonlyArray<ValidationFn<TModel[KeyOf<TModel>]>>>;
type ValidationsDictionaryInput<TModel extends object, Key extends KeyOf<TModel>> = Prettify<{
  [P in Key]: ReadonlyArray<ValidationFn<TModel[Key]>>;
  // TODO use ConcatArray instead of ReadonlyArray?
  // [P in Key]: ConcatArray<ValidationFn<TModel[Key]>>;
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
 */
export type CascadeMode = 'Continue' | 'Stop';

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

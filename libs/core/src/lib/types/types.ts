import { KeyOf } from './ts-helpers';

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
 * Represents the severity of a validation failure.
 */
export type Severity = 'Error' | 'Warning' | 'Info';

/**
 * Configuration for the validator.
 */
export interface ValidatorConfig<TModel extends object> {
  /**
   * If true, the validator will throw a ValidationError if any failures occur.
   */
  throwOnFailures?: boolean;
  /**
   * The properties to include in the validation.
   */
  includeProperties?: KeyOf<TModel> | KeyOf<TModel>[];
  /**
   * The cascade mode on validator level.
   */
  cascadeMode?: CascadeMode;
  /**
   * The cascade mode on property level.
   */
  propertyCascadeMode?: CascadeMode;
}

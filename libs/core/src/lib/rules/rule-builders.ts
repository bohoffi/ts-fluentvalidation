import {
  ApplyConditionTo,
  CascadeMode,
  LengthProperty,
  NumberProperty,
  ObjectProperty,
  RuleCondition,
  RulePredicate,
  StringProperty,
  ValidatorContract
} from '../models';
import { EmptyObject, Prettify } from '../ts-helpers';

/**
 * Represents a builder for validation rules of all property types.
 * @typeParam T - The type of the object being validated.
 * @typeParam P - The type of the string property being validated.
 */
export type CommonRuleBuilder<T, P> = {
  null(): ExtendedRuleBuilder<T, P>;
  notNull(): ExtendedRuleBuilder<T, P>;
  equal(referenceValue: P): ExtendedRuleBuilder<T, P>;
  notEqual(referenceValue: P): ExtendedRuleBuilder<T, P>;
  must(predicate: RulePredicate<T, P>): ExtendedRuleBuilder<T, P>;
};

/**
 * Represents a builder for string validation rules.
 * @typeParam T - The type of the object being validated.
 * @typeParam P - The type of the string property being validated.
 */
export type StringRuleBuilder<T, P extends StringProperty> = {
  matches(regExp: RegExp): ExtendedRuleBuilder<T, P>;
};

/**
 * Represents a builder for number validation rules.
 * @typeParam T - The type of the object being validated.
 * @typeParam P - The type of the number property being validated.
 */
export type NumberRuleBuilder<T, P extends NumberProperty> = {
  lessThan(referenceValue: number): ExtendedRuleBuilder<T, P>;
  lessThanOrEqualTo(referenceValue: number): ExtendedRuleBuilder<T, P>;
  greaterThan(referenceValue: number): ExtendedRuleBuilder<T, P>;
  greaterThanOrEqualTo(referenceValue: number): ExtendedRuleBuilder<T, P>;
  exclusiveBetween(lowerBound: number, upperBound: number): ExtendedRuleBuilder<T, P>;
  inclusiveBetween(lowerBound: number, upperBound: number): ExtendedRuleBuilder<T, P>;
};

/**
 * Represents a builder for length validation rules.
 * @typeParam T - The type of the model being validated.
 * @typeParam P - The type of the property being validated.
 */
export type LengthRuleBuilder<T, P extends LengthProperty> = {
  maxLength(maxLength: number): ExtendedRuleBuilder<T, P>;
  minLength(minLength: number): ExtendedRuleBuilder<T, P>;
  length(min: number, max: number): ExtendedRuleBuilder<T, P>;
  empty(): ExtendedRuleBuilder<T, P>;
  notEmpty(): ExtendedRuleBuilder<T, P>;
};

/**
 * Represents a builder for defining rules for an object property.
 * @typeParam T - The type of the object being validated.
 * @typeParam P - The type of the object property being validated.
 */
export type ObjectRuleBuilder<T, P extends ObjectProperty> = {
  setValidator(validator: ValidatorContract<P>): ExtendedRuleBuilder<T, P>;
};

/**
 * Represents a typed rule builder that combines various rule builders based on the property type.
 * @typeParam T - The type of the object being validated.
 * @typeParam P - The type of the property being validated.
 */
export type TypedRuleBuilder<T, P> = Prettify<
  CommonRuleBuilder<T, P> &
    (P extends StringProperty ? StringRuleBuilder<T, P> : EmptyObject) &
    (P extends NumberProperty ? NumberRuleBuilder<T, P> : EmptyObject) &
    (P extends LengthProperty ? LengthRuleBuilder<T, P> : EmptyObject) &
    (P extends ObjectProperty ? ObjectRuleBuilder<T, P> : EmptyObject) &
    CascadingRuleBuilder<T, P>
>;

/**
 * Represents a builder for for defining cascading rules.
 * @typeParam T  -The type of the model being validated.
 * @typeParam P - The type of the property being validated.
 */
export type CascadingRuleBuilder<T, P> = {
  /**
   * Specifies the cascade mode for a property validation chain.
   *
   * If set to `Stop` then the execution of the validation will stop once the first rule fails.
   *
   * If set to `Continue` - the default - then all rules will execute regardless of failures.
   *
   * @param cascadeMode The cascade mode to set on this rule.
   * @returns A builder for conditional rules.
   */
  cascade(cascadeMode: CascadeMode): ConditionalRuleBuilder<T, P>;
};

/**
 * Represents a builder for conditional rules.
 * @typeParam T - The type of the object being validated.
 * @typeParam P - The type of the property being validated.
 */
export type ConditionalRuleBuilder<T, P> = TypedRuleBuilder<T, P> & {
  /**
   * Specifies a condition that must be met for the rule to be applied.
   * @param condition The condition to be evaluated.
   * @param applyConditionTo The target to which the condition should be applied.
   * @returns The current instance of the rule builder.
   */
  when(condition: RuleCondition<T>, applyConditionTo?: ApplyConditionTo): TypedRuleBuilder<T, P>;

  /**
   * Specifies a condition that must not be met for the rule to be applied.
   * @param condition The condition to be evaluated.
   * @param applyConditionTo The target to which the condition should be applied.
   * @returns The current instance of the rule builder.
   */
  unless(condition: RuleCondition<T>, applyConditionTo?: ApplyConditionTo): TypedRuleBuilder<T, P>;
};

/**
 * Represents an extended rule builder that combines the functionality of a conditional rule builder
 * with additional methods for setting the error message and property name.
 *
 * @typeParam T - The type of the object being validated.
 * @typeParam P - The type of the property being validated.
 */
export type ExtendedRuleBuilder<T, P> = ConditionalRuleBuilder<T, P> & {
  withMessage(message: string): ConditionalRuleBuilder<T, P>;
  withName(propertyName: string): ConditionalRuleBuilder<T, P>;
};

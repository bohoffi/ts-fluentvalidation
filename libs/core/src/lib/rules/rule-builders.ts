import { ApplyConditionTo, CascadeMode, LengthProperty, NumberProperty, RuleCondition, RulePredicate, StringProperty } from '../models';
import { EmptyObject, Prettify } from '../ts-helpers';

export type CommonRuleBuilder<T, P> = {
  isNull(): ExtendedRuleBuilder<T, P>;
  notNull(): ExtendedRuleBuilder<T, P>;
  equals(referenceValue: P): ExtendedRuleBuilder<T, P>;
  notEquals(referenceValue: P): ExtendedRuleBuilder<T, P>;
  must(predicate: RulePredicate<T, P>): ExtendedRuleBuilder<T, P>;
};

export type StringRuleBuilder<T, P extends StringProperty> = {
  matches(regExp: RegExp): ExtendedRuleBuilder<T, P>;
};

export type NumberRuleBuilder<T, P extends NumberProperty> = {
  lessThan(referenceValue: number): ExtendedRuleBuilder<T, P>;
  lessThanOrEqualTo(referenceValue: number): ExtendedRuleBuilder<T, P>;
  greaterThan(referenceValue: number): ExtendedRuleBuilder<T, P>;
  greaterThanOrEqualTo(referenceValue: number): ExtendedRuleBuilder<T, P>;
  isPositive(): ExtendedRuleBuilder<T, P>;
  isNegative(): ExtendedRuleBuilder<T, P>;
  exclusiveBetween(lowerBound: number, upperBound: number): ExtendedRuleBuilder<T, P>;
  inclusiveBetween(lowerBound: number, upperBound: number): ExtendedRuleBuilder<T, P>;
};

export type LengthRuleBuilder<TModel, TProperty extends LengthProperty> = {
  maxLength(maxLength: number): ExtendedRuleBuilder<TModel, TProperty>;
  minLength(minLength: number): ExtendedRuleBuilder<TModel, TProperty>;
  empty(): ExtendedRuleBuilder<TModel, TProperty>;
  notEmpty(): ExtendedRuleBuilder<TModel, TProperty>;
};

export type TypedRuleBuilder<T, P> = Prettify<
  CommonRuleBuilder<T, P> &
    (P extends StringProperty ? StringRuleBuilder<T, P> : EmptyObject) &
    (P extends NumberProperty ? NumberRuleBuilder<T, P> : EmptyObject) &
    (P extends LengthProperty ? LengthRuleBuilder<T, P> : EmptyObject) &
    CascadingRuleBuilder<T, P>
>;

export type CascadingRuleBuilder<TModel, TProperty> = {
  /**
   * Specifies the cascade mode for a property validation chain.
   *
   * If set to `Stop` then the execution of the validation will stop once the first rule fails.
   *
   * If set to `Continue` - the default - then all rules will execute regardless of failures.
   * @param cascadeMode mode to set on this rule
   */
  cascade(cascadeMode: CascadeMode): ConditionalRuleBuilder<TModel, TProperty>;
};

/**
 * Represents a builder for conditional rules.
 * @template T The type of the object being validated.
 * @template P The type of the property being validated.
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
 * @template T - The type of the object being validated.
 * @template P - The type of the property being validated.
 */
export type ExtendedRuleBuilder<T, P> = ConditionalRuleBuilder<T, P> & {
  withMessage(message: string): ConditionalRuleBuilder<T, P>;
  withName(propertyName: string): ConditionalRuleBuilder<T, P>;
};

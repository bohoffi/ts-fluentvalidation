import { Nullish } from './ts-helpers';

// Parameter types
export type MemberExpression<T, V = unknown> = (obj: T) => V;

// Properties
export type StringProperty = Nullish<string>;
export type NumberProperty = Nullish<number>;
export type LengthProperty = Nullish<{ length: number }>;
export type ObjectProperty = Nullish<object>;

// Configs
export type ApplyConditionTo = 'AllValidators' | 'CurrentValidator';
export type CascadeMode = 'Continue' | 'Stop';
export interface ValidatorConfig {
  ruleLevelCascadeMode?: CascadeMode;
  validatorLevelCascadeMode: CascadeMode;
}

// Rules
export interface ValidationContext<T> {
  candidate: T;
}
export type RuleCondition<T> = (model: T) => boolean;
export type ValidationFn<T, P> = (value: P, validationContext: ValidationContext<T>) => boolean;
export type RulePredicate<T, P> = (value: P, model: T) => boolean;

export type RuleBuilderContract<TRuleBuilder> = {
  [K in keyof TRuleBuilder]: unknown;
};

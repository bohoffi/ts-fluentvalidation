import { EqualsRule, IsNotNullRule, IsNullRule, MustRule, NotEqualsRule } from './common';
import { AbstractRule } from './rule';
import {
  ExclusiveBetweenRule,
  GreaterThanOrEqualRule,
  GreaterThanRule,
  InclusiveBetweenRule,
  IsNegativeRule,
  IsPositiveRule,
  LessThanOrEqualRule,
  LessThanRule
} from './number';
import { MatchesRule } from './string';
import {
  ApplyConditionTo,
  CascadeMode,
  LengthProperty,
  NumberProperty,
  RuleBuilderContract,
  RuleCondition,
  RulePredicate,
  StringProperty
} from '../models';
import {
  CascadingRuleBuilder,
  CommonRuleBuilder,
  ConditionalRuleBuilder,
  ExtendedRuleBuilder,
  LengthRuleBuilder,
  NumberRuleBuilder,
  StringRuleBuilder,
  TypedRuleBuilder
} from './rule-builders';
import { PropertyValidator } from '../property-validator';
import { EmptyRule, MaxLengthRule, MinLengthRule, NotEmptyRule } from './length';

export class AbstractRuleBuilder<T extends object, P> {
  constructor(private readonly validator: PropertyValidator<T, P>) {}

  public build() {
    return this.typedRuleBuilder() as unknown as TypedRuleBuilder<T, P>;
  }

  private commonRuleBuilder(): RuleBuilderContract<CommonRuleBuilder<T, P>> {
    return {
      isNull: () => {
        this.addValidationStep(new IsNullRule<T, P>());
        return this.rulesWithExtensionsAndConditions();
      },
      notNull: () => {
        this.addValidationStep(new IsNotNullRule<T, P>());
        return this.rulesWithExtensionsAndConditions();
      },
      equals: (referenceValue: P) => {
        this.addValidationStep(new EqualsRule(referenceValue));
        return this.rulesWithExtensionsAndConditions();
      },
      notEquals: (referenceValue: P) => {
        this.addValidationStep(new NotEqualsRule(referenceValue));
        return this.rulesWithExtensionsAndConditions();
      },
      must: (predicate: RulePredicate<T, P>) => {
        this.addValidationStep(new MustRule(predicate));
        return this.rulesWithExtensionsAndConditions();
      }
    };
  }

  private stringRuleBuilder(): RuleBuilderContract<StringRuleBuilder<T, StringProperty>> {
    return {
      matches: (pattern: RegExp) => {
        this.addValidationStep(new MatchesRule(pattern) as AbstractRule<T, P>);
        return this.rulesWithExtensionsAndConditions();
      }
    };
  }

  private numberRuleBuilder(): RuleBuilderContract<NumberRuleBuilder<T, NumberProperty>> {
    return {
      isPositive: () => {
        this.addValidationStep(new IsPositiveRule() as AbstractRule<T, P>);
        return this.rulesWithExtensionsAndConditions();
      },
      isNegative: () => {
        this.addValidationStep(new IsNegativeRule() as AbstractRule<T, P>);
        return this.rulesWithExtensionsAndConditions();
      },
      exclusiveBetween: (lowerBound: number, upperBound: number) => {
        this.addValidationStep(new ExclusiveBetweenRule(lowerBound, upperBound) as AbstractRule<T, P>);
        return this.rulesWithExtensionsAndConditions();
      },
      inclusiveBetween: (lowerBound: number, upperBound: number) => {
        this.addValidationStep(new InclusiveBetweenRule(lowerBound, upperBound) as AbstractRule<T, P>);
        return this.rulesWithExtensionsAndConditions();
      },
      lessThan: (referenceValue: number) => {
        this.addValidationStep(new LessThanRule(referenceValue) as AbstractRule<T, P>);
        return this.rulesWithExtensionsAndConditions();
      },
      lessThanOrEqualTo: (referenceValue: number) => {
        this.addValidationStep(new LessThanOrEqualRule(referenceValue) as AbstractRule<T, P>);
        return this.rulesWithExtensionsAndConditions();
      },
      greaterThan: (referenceValue: number) => {
        this.addValidationStep(new GreaterThanRule(referenceValue) as AbstractRule<T, P>);
        return this.rulesWithExtensionsAndConditions();
      },
      greaterThanOrEqualTo: (referenceValue: number) => {
        this.addValidationStep(new GreaterThanOrEqualRule(referenceValue) as AbstractRule<T, P>);
        return this.rulesWithExtensionsAndConditions();
      }
    };
  }

  private lengthRuleBuilder(): RuleBuilderContract<LengthRuleBuilder<T, LengthProperty>> {
    return {
      empty: () => {
        this.addValidationStep(new EmptyRule() as AbstractRule<T, P>);
        return this.rulesWithExtensionsAndConditions();
      },
      notEmpty: () => {
        this.addValidationStep(new NotEmptyRule() as AbstractRule<T, P>);
        return this.rulesWithExtensionsAndConditions();
      },
      maxLength: (maxLength: number) => {
        this.addValidationStep(new MaxLengthRule(maxLength) as AbstractRule<T, P>);
        return this.rulesWithExtensionsAndConditions();
      },
      minLength: (minLength: number) => {
        this.addValidationStep(new MinLengthRule(minLength) as AbstractRule<T, P>);
        return this.rulesWithExtensionsAndConditions();
      }
    };
  }

  private typedRuleBuilder(): ReturnType<AbstractRuleBuilder<T, P>['commonRuleBuilder']> &
    ReturnType<AbstractRuleBuilder<T, P>['stringRuleBuilder']> &
    ReturnType<AbstractRuleBuilder<T, P>['numberRuleBuilder']> &
    ReturnType<AbstractRuleBuilder<T, P>['lengthRuleBuilder']> &
    ReturnType<AbstractRuleBuilder<T, P>['cascadingRuleBuilder']> {
    return {
      ...this.commonRuleBuilder(),
      ...this.stringRuleBuilder(),
      ...this.numberRuleBuilder(),
      ...this.lengthRuleBuilder(),
      ...this.cascadingRuleBuilder()
    };
  }

  private cascadingRuleBuilder(): RuleBuilderContract<CascadingRuleBuilder<T, P>> {
    return {
      cascade: (cascadeMode: CascadeMode) => {
        this.validator.cascade(cascadeMode);
        return this.rulesWithExtensionsAndConditions();
      }
    };
  }

  private conditionalRuleBuilder(): RuleBuilderContract<Pick<ConditionalRuleBuilder<T, P>, 'when' | 'unless'>> {
    return {
      when: (condition: RuleCondition<T>, applyConditionTo: ApplyConditionTo = 'AllValidators') => {
        if (applyConditionTo === 'AllValidators') {
          this.validator.propertyRules.forEach(rule => rule.withWhenCondition(condition));
        } else {
          this.validator.propertyRules[this.validator.propertyRules.length - 1].withWhenCondition(condition);
        }
        return this.typedRuleBuilder();
      },
      unless: (condition: RuleCondition<T>, applyConditionTo: ApplyConditionTo = 'AllValidators') => {
        if (applyConditionTo === 'AllValidators') {
          this.validator.propertyRules.forEach(rule => rule.withUnlessCondition(condition));
        } else {
          this.validator.propertyRules[this.validator.propertyRules.length - 1].withUnlessCondition(condition);
        }
        return this.typedRuleBuilder();
      }
    };
  }

  private extendedRuleBuilder(): RuleBuilderContract<Pick<ExtendedRuleBuilder<T, P>, 'withMessage' | 'withName'>> {
    return {
      withMessage: (message: string) => {
        this.validator.propertyRules[this.validator.propertyRules.length - 1].withMessage(message);
        return this.conditionalRuleBuilder();
      },
      withName: (propertyName: string) => {
        this.validator.propertyRules[this.validator.propertyRules.length - 1].withName(propertyName);
        return this.conditionalRuleBuilder();
      }
    };
  }

  private rulesWithExtensionsAndConditions(): RuleBuilderContract<
    Pick<ExtendedRuleBuilder<T, P>, 'unless' | 'when' | 'withMessage' | 'withName'>
  > &
    unknown {
    return {
      ...this.typedRuleBuilder(),
      ...this.conditionalRuleBuilder(),
      ...this.extendedRuleBuilder()
    };
  }

  private addValidationStep(rule: AbstractRule<T, P>) {
    this.validator.addRule(rule);
  }
}

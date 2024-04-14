import { EqualRule, NotNullRule, NullRule, MustRule, NotEqualRule } from './common';
import { AbstractRule } from './rule';
import {
  ExclusiveBetweenRule,
  GreaterThanOrEqualRule,
  GreaterThanRule,
  InclusiveBetweenRule,
  LessThanOrEqualRule,
  LessThanRule
} from './number';
import { MatchesRule } from './string';
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
import {
  CascadingRuleBuilder,
  CommonRuleBuilder,
  ConditionalRuleBuilder,
  ExtendedRuleBuilder,
  LengthRuleBuilder,
  NumberRuleBuilder,
  ObjectRuleBuilder,
  StringRuleBuilder,
  TypedRuleBuilder
} from './rule-builders';
import { PropertyValidator } from '../property-validator';
import { EmptyRule, LengthRule, MaxLengthRule, MinLengthRule, NotEmptyRule } from './length';
import { SetValidatorRule } from './object';

type RuleBuilderContract<TRuleBuilder> = {
  [K in keyof TRuleBuilder]: unknown;
};

export class AbstractRuleBuilder<T extends object, P> {
  constructor(private readonly validator: PropertyValidator<T, P>) {}

  public build() {
    return this.typedRuleBuilder() as unknown as TypedRuleBuilder<T, P>;
  }

  private commonRuleBuilder(): RuleBuilderContract<CommonRuleBuilder<T, P>> {
    return {
      null: () => {
        this.addValidationStep(new NullRule<T, P>());
        return this.rulesWithExtensionsAndConditions();
      },
      notNull: () => {
        this.addValidationStep(new NotNullRule<T, P>());
        return this.rulesWithExtensionsAndConditions();
      },
      equal: (referenceValue: P) => {
        this.addValidationStep(new EqualRule(referenceValue));
        return this.rulesWithExtensionsAndConditions();
      },
      notEqual: (referenceValue: P) => {
        this.addValidationStep(new NotEqualRule(referenceValue));
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
      },
      length: (minLength: number, maxLength: number) => {
        this.addValidationStep(new LengthRule(minLength, maxLength) as AbstractRule<T, P>);
        return this.rulesWithExtensionsAndConditions();
      }
    };
  }

  private objectRuleBuilder(): RuleBuilderContract<ObjectRuleBuilder<T, ObjectProperty>> {
    return {
      setValidator: (validator: ValidatorContract<ObjectProperty>) => {
        this.addValidationStep(new SetValidatorRule(validator) as AbstractRule<T, P>);
        return this.rulesWithExtensionsAndConditions();
      }
    };
  }

  private typedRuleBuilder(): ReturnType<AbstractRuleBuilder<T, P>['commonRuleBuilder']> &
    ReturnType<AbstractRuleBuilder<T, P>['stringRuleBuilder']> &
    ReturnType<AbstractRuleBuilder<T, P>['numberRuleBuilder']> &
    ReturnType<AbstractRuleBuilder<T, P>['lengthRuleBuilder']> &
    ReturnType<AbstractRuleBuilder<T, P>['objectRuleBuilder']> &
    ReturnType<AbstractRuleBuilder<T, P>['cascadingRuleBuilder']> {
    return {
      ...this.commonRuleBuilder(),
      ...this.stringRuleBuilder(),
      ...this.numberRuleBuilder(),
      ...this.lengthRuleBuilder(),
      ...this.objectRuleBuilder(),
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

import { CascadeMode } from './models';
import { AbstractRule } from './rules/rule';
import { KeyOf } from './ts-helpers';
import { ValidationContext } from './validation-context';

export class PropertyValidator<T, P> {
  public readonly propertyRules: AbstractRule<T, P>[] = [];
  private cascadeMode: CascadeMode = 'Continue';

  constructor(public readonly propertyName: KeyOf<T>) {}

  public addRule(rule: AbstractRule<T, P>): void {
    this.propertyRules.push(rule);
  }

  public cascade(cascadeMode: CascadeMode): void {
    this.cascadeMode = cascadeMode;
  }

  public validateProperty(propertyValue: P, validationContext: ValidationContext<T>): void {
    for (const rule of this.propertyRules) {
      if (!processRuleWhen(rule, validationContext) || !processRuleUnless(rule, validationContext)) {
        continue;
      }

      const result = rule.validate(propertyValue, validationContext, this.propertyName as string);

      if (result === false && this.cascadeMode === 'Stop') {
        break;
      }
    }
  }
}

const processRuleWhen = <T, P>(rule: AbstractRule<T, P>, validationContext: ValidationContext<T>): boolean =>
  rule.processWhen ? rule.processWhen(validationContext.instanceToValidate) : true;
const processRuleUnless = <T, P>(rule: AbstractRule<T, P>, validationContext: ValidationContext<T>): boolean =>
  rule.processUnless ? !rule.processUnless(validationContext.instanceToValidate) : true;

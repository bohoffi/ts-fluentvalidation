import { createMessageFormatter } from './message-formatter';
import { CascadeMode, ValidationContext } from './models';
import { AbstractRule } from './rules/rule';
import { KeyOf } from './ts-helpers';
import { ValidationFailure } from './result/validation-failure';

export class PropertyValidator<T, P> {
  public readonly propertyRules: AbstractRule<T, P>[] = [];
  private readonly messageFormatter = createMessageFormatter();
  private cascadeMode: CascadeMode = 'Continue';

  constructor(public readonly propertyName: KeyOf<T>) {}

  public addRule(rule: AbstractRule<T, P>): void {
    this.propertyRules.push(rule);
  }

  public cascade(cascadeMode: CascadeMode): void {
    this.cascadeMode = cascadeMode;
  }

  public validate(value: P, validationContext: ValidationContext<T>): ValidationFailure[] {
    const failures: ValidationFailure[] = [];

    for (const rule of this.propertyRules) {
      if (!processRuleWhen(rule, validationContext) || !processRuleUnless(rule, validationContext)) {
        continue;
      }

      const result = rule.validate(value, validationContext);

      if (result === false) {
        this.messageFormatter.appendPropertyName(rule.propertyName || (this.propertyName as string));
        this.messageFormatter.appendPropertyValue(value);
        rule.appendArguments?.(this.messageFormatter);
        failures.push({
          propertyName: this.propertyName as string,
          message: this.messageFormatter.formatWithPlaceholders(rule.message || rule.errorMessage),
          attemptedValue: value as unknown
        });

        if (this.cascadeMode === 'Stop') {
          break;
        }
      }
    }

    return failures;
  }
}

const processRuleWhen = <T, P>(rule: AbstractRule<T, P>, validationContext: ValidationContext<T>): boolean =>
  rule.processWhen ? rule.processWhen(validationContext.candidate) : true;
const processRuleUnless = <T, P>(rule: AbstractRule<T, P>, validationContext: ValidationContext<T>): boolean =>
  rule.processUnless ? !rule.processUnless(validationContext.candidate) : true;

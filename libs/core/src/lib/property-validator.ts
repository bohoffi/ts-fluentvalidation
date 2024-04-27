import { AbstractPropertyValidator } from './abstract-property-validator';
import { AbstractRule } from './rules/rule';
import { ValidationContext } from './validation-context';

export class PropertyValidator<T, P> extends AbstractPropertyValidator<T, P> {
  public validateProperty(propertyValue: P, validationContext: ValidationContext<T>): void {
    for (const rule of this.propertyRules) {
      if (!processRuleWhen(rule, validationContext) || !processRuleUnless(rule, validationContext)) {
        continue;
      }

      const propertyPath = validationContext.propertyChain.buildPropertyPath(this.propertyName as string);
      validationContext.initializeForPropertyValidator(propertyPath, this.propertyName as string);
      validationContext.messageFormatter.reset();

      // const result = rule.validate(propertyValue, validationContext, this.propertyName as string);
      const result = rule.validate(propertyValue, validationContext);

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

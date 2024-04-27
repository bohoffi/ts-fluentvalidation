import { AbstractPropertyValidator } from './abstract-property-validator';
import { AbstractRule } from './rules/rule';
import { ValidationContext } from './validation-context';

export class CollectionPropertyValidator<T extends object, P> extends AbstractPropertyValidator<T, P> {
  public validateProperty(propertyValue: Iterable<P>, validationContext: ValidationContext<T>): void {
    for (const rule of this.propertyRules) {
      if (!processRuleWhen(rule, validationContext) || !processRuleUnless(rule, validationContext)) {
        continue;
      }

      let count = 0;

      for (const valueToValidate of propertyValue) {
        const index = count++;

        validationContext.prepareForChildCollectionRule();
        validationContext.propertyChain.add(this.propertyName as string);
        validationContext.propertyChain.addIndexer(index.toString());

        const propertyPath = validationContext.propertyChain.toString();
        validationContext.initializeForPropertyValidator(propertyPath, this.propertyName as string);

        validationContext.messageFormatter.reset();
        validationContext.messageFormatter.appendOrUpdateArgument(
          validationContext.messageFormatter.basePlaceholders.collectionIndex,
          index
        );

        // const result = rule.validate(valueToValidate, validationContext, this.propertyName as string);
        const result = rule.validate(valueToValidate, validationContext);

        if (result === false && this.cascadeMode === 'Stop') {
          break;
        }
      }
    }
  }
}

const processRuleWhen = <T, P>(rule: AbstractRule<T, P>, validationContext: ValidationContext<T>): boolean =>
  rule.processWhen ? rule.processWhen(validationContext.instanceToValidate) : true;
const processRuleUnless = <T, P>(rule: AbstractRule<T, P>, validationContext: ValidationContext<T>): boolean =>
  rule.processUnless ? !rule.processUnless(validationContext.instanceToValidate) : true;

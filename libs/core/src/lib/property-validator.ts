import { AbstractPropertyValidator } from './abstract-property-validator';
import { AbstractAsyncRule } from './rules/rule';
import { ValidationContext } from './validation-context';

/**
 * Represents a validator for properties.
 * @typeParam T - The type of the object being validated.
 * @typeParam P - The type of the property being validated.
 */
export class PropertyValidator<T, P> extends AbstractPropertyValidator<T, P> {
  /**
   * Validates the specified property value against the defined rules.
   *
   * @param propertyValue - The value of the property to validate.
   * @param validationContext - The validation context containing information about the validation process.
   */
  public validateProperty(propertyValue: P, validationContext: ValidationContext<T>): void {
    this.ensureAllRulesSync();

    for (const rule of this.propertyRules) {
      if (!this.processRuleWhen(rule, validationContext) || !this.processRuleUnless(rule, validationContext)) {
        continue;
      }

      const propertyPath = validationContext.propertyChain.buildPropertyPath(this.propertyName as string);
      validationContext.initializeForPropertyValidator(propertyPath, this.propertyName as string);
      validationContext.messageFormatter.reset();

      const result = rule.validate(propertyValue, validationContext);

      if (result === false && this.cascadeMode === 'Stop') {
        break;
      }
    }
  }

  /**
   * Asynchronously validates the property.
   *
   * @param propertyValue - The value of the property to be validated.
   * @param validationContext - The validation context containing information about the validation process.
   * @returns A Promise that resolves to void when the validation is complete.
   */
  public async validatePropertyAsync(propertyValue: P, validationContext: ValidationContext<T>): Promise<void> {
    for (const rule of this.propertyRules) {
      if (!this.processRuleWhen(rule, validationContext) || !this.processRuleUnless(rule, validationContext)) {
        continue;
      }

      const propertyPath = validationContext.propertyChain.buildPropertyPath(this.propertyName as string);
      validationContext.initializeForPropertyValidator(propertyPath, this.propertyName as string);
      validationContext.messageFormatter.reset();

      const result =
        rule instanceof AbstractAsyncRule
          ? await rule.validateAsync(propertyValue, validationContext)
          : rule.validate(propertyValue, validationContext);

      if (result === false && this.cascadeMode === 'Stop') {
        break;
      }
    }
  }
}

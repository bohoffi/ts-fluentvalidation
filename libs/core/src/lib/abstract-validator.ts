import { AbstractPropertyValidator } from './abstract-property-validator';
import { CollectionPropertyValidator } from './collection-property-validator';
import { CascadeMode, MemberExpression } from './models';
import { PropertyValidator } from './property-validator';
import { ValidationResult } from './result';
import { AbstractRuleBuilder } from './rules/rule-builder';
import { TypedRuleBuilder } from './rules/rule-builders';
import { ArrayKeyOf, EmptyObject, KeyOf } from './ts-helpers';
import { ValidationContext } from './validation-context';

type PropertyValidators<T> = {
  [K in keyof T]: AbstractPropertyValidator<T, T[K]>;
};

/**
 * Abstract base class for validators.
 * @typeParam T - The type of the object being validated.
 *
 * @usageNotes
 *
 * ```typescript
 * interface Person {
 *   name: string;
 *   age: number;
 * }
 *
 * class PersonValidator extends AbstractValidator<Person> {
 *   constructor() {
 *     super();
 *     this.ruleFor(x => x.name).notEmpty().withMessage('Name is required');
 *     this.ruleFor(x => x.age).greaterThanOrEqual(18).withMessage('Age must be 18 or greater');
 *   }
 * }
 */
export abstract class AbstractValidator<T extends object = EmptyObject> {
  /**
   * The cascade mode for class-level validation.
   * Determines how validation should proceed when encountering validation failures at the class level.
   */
  public classLevelCascadeMode: CascadeMode = 'Continue';
  /**
   * The cascade mode for rule level validation.
   * Determines how rule level validation should behave when a failure occurs.
   */
  public ruleLevelCascadeMode: CascadeMode = 'Continue';

  /**
   * Holds the property validators for the abstract validator.
   */
  private readonly propertyValidators: Partial<PropertyValidators<T>> = {};

  /**
   * Defines a rule for validating a specific property of the object being validated.
   * @param memberExpression - The member expression identifying the property to validate.
   * @returns A `TypedRuleBuilder` instance for building validation rules for the specified property.
   * @throws {@link Error} if an invalid member expression is provided.
   */
  public ruleFor<V>(memberExpression: MemberExpression<T, V>): TypedRuleBuilder<T, V>;
  /**
   * Defines a rule for validating a specific property of the object being validated.
   * @param propertyName - The property name identifying the property to validate.
   * @returns A `TypedRuleBuilder` instance for building validation rules for the specified property.
   * @throws {@link Error} if an invalid property name is provided.
   */
  public ruleFor<PropertyName extends KeyOf<T>, V = T[PropertyName]>(propertyName: PropertyName): TypedRuleBuilder<T, V>;
  /**
   * Defines a rule for validating a specific property of the object being validated.
   * @param memberExpressionOrPropertyName - The member expression or property name identifying the property to validate.
   * @returns A `TypedRuleBuilder` instance for building validation rules for the specified property.
   * @throws {@link Error} if an invalid member expression or property name is provided.
   */
  public ruleFor<V>(memberExpressionOrPropertyName: MemberExpression<T, V> | KeyOf<T>): TypedRuleBuilder<T, V> {
    const propertyName: KeyOf<T> =
      typeof memberExpressionOrPropertyName === 'function'
        ? this.getPropertyNameFromMemberExpression(memberExpressionOrPropertyName)
        : memberExpressionOrPropertyName;

    if (!propertyName) {
      throw new Error(`Invalid member expression or property name: ${memberExpressionOrPropertyName.toString()}`);
    }

    const propertyValidator = this.createPropertyValidator<V>(propertyName);

    this.propertyValidators[propertyName] = propertyValidator as PropertyValidator<T, unknown>;
    return new AbstractRuleBuilder<T, V>(propertyValidator).build();
  }

  /**
   * Creates a rule builder for validating each item in an array property.
   *
   * @param propertyName - The name of the property to validate.
   * @returns A `TypedRuleBuilder` instance for building validation rules for the array property.
   */
  public ruleForEach<PropertyName extends ArrayKeyOf<T>, V extends T[PropertyName] extends Array<infer Item> ? Item : never>(
    propertyName: PropertyName
  ): TypedRuleBuilder<T, V> {
    const propertyValidator = this.createCollectionPropertyValidator<V>(propertyName as unknown as ArrayKeyOf<T>);

    this.propertyValidators[propertyName] = propertyValidator as CollectionPropertyValidator<T, unknown>;
    return new AbstractRuleBuilder<T, V>(propertyValidator).build();
  }

  /**
   * Creates a property validator for the specified property name.
   *
   * @typeParam V - The type of the property value.
   * @param propertyName - The name of the property to validate.
   * @returns A `PropertyValidator` instance for the specified property.
   */
  private createPropertyValidator<V>(propertyName: KeyOf<T>): PropertyValidator<T, V> {
    const validator = new PropertyValidator<T, V>(propertyName);
    if (this.ruleLevelCascadeMode) {
      validator.cascade(this.ruleLevelCascadeMode);
    }
    return validator;
  }

  /**
   * Creates a collection property validator for the specified property name.
   *
   * @typeParam V - The type of the property value.
   * @param propertyName - The name of the property to validate.
   * @returns A `CollectionPropertyValidator` instance for the specified property.
   */
  private createCollectionPropertyValidator<V>(propertyName: ArrayKeyOf<T>): CollectionPropertyValidator<T, V> {
    const validator = new CollectionPropertyValidator<T, V>(propertyName);
    if (this.ruleLevelCascadeMode) {
      validator.cascade(this.ruleLevelCascadeMode);
    }
    return validator;
  }

  /**
   * Validates the given instance.
   * @param instance - The instance to validate.
   * @returns The validation result.
   */
  public validate(instance: T): ValidationResult;
  /**
   * Validates the given validation context.
   * @param validationContext - The validation context to validate.
   * @returns The validation result.
   */
  public validate(validationContext: ValidationContext<T>): ValidationResult;
  /**
   * Validates the given instance or validation context.
   * @param instanceOrValidationContext - The instance or validation context to validate.
   * @returns The validation result.
   */
  public validate(instanceOrValidationContext: T | ValidationContext<T>): ValidationResult {
    const validationContext =
      instanceOrValidationContext instanceof ValidationContext
        ? instanceOrValidationContext
        : new ValidationContext(instanceOrValidationContext);

    for (const [key, rule] of Object.entries(this.propertyValidators)) {
      const typeKey = key as KeyOf<T>;
      const propertyValidator = rule as AbstractPropertyValidator<T, typeof typeKey>;
      const propertyValue = validationContext.instanceToValidate[typeKey];

      if (propertyValidator instanceof PropertyValidator) {
        propertyValidator.validateProperty(propertyValue as typeof propertyValidator.propertyName, validationContext);
      } else if (propertyValidator instanceof CollectionPropertyValidator) {
        propertyValidator.validateProperty(propertyValue as typeof propertyValidator.propertyName, validationContext);
      }

      if (validationContext.failues.length > 0 && this.classLevelCascadeMode === 'Stop') {
        break;
      }
    }
    return new ValidationResult(validationContext.failues);
  }

  /**
   * Extracts the property name from a member expression - e.g. (obj: T) => obj.property
   * TODO [#18](https://github.com/bohoffi/ts-fluentvalidation/issues/18)
   * @param memberExpression - The member expression to extract the property name from.
   * @throws {@link Error} if the member expression is invalid.
   * @returns The property name.
   */
  private getPropertyNameFromMemberExpression(memberExpression: MemberExpression<T>): KeyOf<T> {
    const expressionString = memberExpression.toString();
    const match = expressionString.match(/\.(\w+)/);
    // const match = expressionString.match(/\.(\w+(\.\w+)*)/);
    if (match) {
      const propertyName = match.length >= 2 ? match[1] : '';
      return propertyName as KeyOf<T>;
    }
    throw new Error(`Invalid MemberExpression: '${expressionString}'`);
  }
}

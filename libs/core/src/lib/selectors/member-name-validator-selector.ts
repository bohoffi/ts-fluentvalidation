import { AbstractPropertyValidator } from '../abstract-property-validator';
import { ValidationContext } from '../validation-context';
import { ValidatorSelector } from './validator-selector';

export class MemberNameValidatorSelector implements ValidatorSelector {
  constructor(private readonly memberNames: string[]) {}

  public canExecute<T, P>(
    validator: AbstractPropertyValidator<T, P>,
    propertyPath: string,
    validationContext: ValidationContext<T>
  ): boolean {
    // Validator selector only applies to the top level.
    // If we're running in a child context then this means that the child validator has already been selected
    // Because of this, we assume that the rule should continue (ie if the parent rule is valid, all children are valid)
    const isChildContext = validationContext.isChildContext;

    // If a child validator is being executed and the cascade is enabled (which is the default)
    // then the child validator's rule should always be included.
    // The only time this isn't the case is if the member names contained for inclusion are for child
    // properties (which is indicated by them containing a period).
    if (isChildContext && !this.memberNames.some(x => x.includes('.'))) {
      return true;
    }

    // Stores the normalized property name if we're working with collection properties
    // eg Orders[0].Name -> Orders[].Name. This is only initialized if needed (see below).
    let normalizedPropertyPath: string | null = null;

    // If property path is for child property within collection,
    // and member path contains wildcard [] then this means that we want to match
    // with all items in the collection, but we need to normalize the property path
    // in order to match. For example, if the propertyPath is "Orders[0].Name"
    // and the memberName for inclusion is "Orders[].Name" then this should
    // be allowed to match.
    return this.memberNames.some(memberName => {
      if (/\[\d+\]/g.test(memberName)) {
        if (normalizedPropertyPath === null) {
          // If the member name is a collection property, normalize the property path
          normalizedPropertyPath = propertyPath.replace(/\[\d+\]/g, '[]');
        }

        return (
          memberName === normalizedPropertyPath ||
          memberName.startsWith(normalizedPropertyPath + '.') ||
          memberName.startsWith(normalizedPropertyPath + '[')
        );
      }

      // If the property path is equal to any of the input member names then it should be executed.
      return (
        propertyPath === memberName ||
        // If the property path is for a child property,
        // and the parent property is selected for inclusion,
        // then it should be allowed to execute.
        propertyPath.startsWith(memberName + '.') ||
        // If the property path is for a parent property,
        // and any of its child properties are selected for inclusion
        // then it should be allowed to execute
        memberName.startsWith(propertyPath + '.') ||
        // If the property path is for a collection property
        // and a child property for this collection has been passed in for inclusion.
        // For example, memberName is "Orders[0].Amount"
        // and propertyPath is "Orders" then it should be allowed to execute.
        memberName.startsWith(propertyPath + '[')
      );
    });
  }
}

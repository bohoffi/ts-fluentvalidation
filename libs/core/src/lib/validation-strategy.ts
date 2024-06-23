import { MemberExpression } from './models';
import { PropertyChain } from './property-chain';
import { CompositeValidatorSelector } from './selectors/composite-validator-selector';
import { DefaultValidatorSelector } from './selectors/default-validator-selector';
import { MemberNameValidatorSelector } from './selectors/member-name-validator-selector';
import { ValidatorSelector } from './selectors/validator-selector';
import { KeyOf } from './ts-helpers';

/**
 * Represents a validation strategy for validating objects.
 * @typeParam T - The type of the object to be validated.
 */
export class ValidationStrategy<T> {
  private _includedProperties?: string[];

  /**
   * Indicates that only the specified properties should be validated.
   * @param propertyNames - Property names to include in validation.
   * @returns The current instance of the `ValidationStrategy` class.
   */
  public includeProperties(...propertyNames: KeyOf<T>[]): ValidationStrategy<T>;

  /**
   * Indicates that only the specified properties should be validated.
   * @param memberExpressions - Member expressions to include in validation.
   * @returns The current instance of the `ValidationStrategy` class.
   */
  public includeProperties(...memberExpressions: MemberExpression<T, unknown>[]): ValidationStrategy<T>;

  /**
   * Includes the specified properties or member expressions for validation.
   * @param memberExpressionOrPropertyName - Member expressions or property names to include in validation.
   * @returns The current instance of the `ValidationStrategy` class.
   */
  public includeProperties(...memberExpressionOrPropertyName: MemberExpression<T, unknown>[] | KeyOf<T>[]): ValidationStrategy<T> {
    if (this._includedProperties === undefined) {
      this._includedProperties = [];
    }
    this._includedProperties.push(
      ...memberExpressionOrPropertyName.map(item => (typeof item === 'function' ? PropertyChain.fromExpression(item).toString() : item))
    );

    return this;
  }

  public getSelector(): ValidatorSelector {
    if (this._includedProperties !== undefined) {
      const selectors: ValidatorSelector[] = [];

      if (this._includedProperties.length > 0) {
        selectors.push(new MemberNameValidatorSelector(this._includedProperties));
      }

      return selectors.length === 1 ? selectors[0] : new CompositeValidatorSelector(selectors);
    } else {
      return new DefaultValidatorSelector();
    }
  }
}

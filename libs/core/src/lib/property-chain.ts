import { MemberExpression } from './models';

/**
 * Represents a chain of property names.
 */
export class PropertyChain {
  private _propertyNames: string[] = [];

  /**
   * Creates a `PropertyChain` from a member expression.
   *
   * @param expression - The member expression.
   * @returns A `PropertyChain` representing the property chain of the expression.
   * @throws Error if the specified expression does not contain a property chain.
   */
  public static fromExpression<T, V>(expression: MemberExpression<T, V>): PropertyChain {
    const expressionString = expression.toString();
    if (!expressionString.includes('.')) {
      throw new Error('The specified expression does not contain a property chain.');
    }
    return new PropertyChain(expression.toString().split('.').slice(1));
  }

  /**
   * Represents a chain of property names.
   */
  constructor(memberNamesOrParentChain?: string[] | PropertyChain) {
    if (memberNamesOrParentChain instanceof PropertyChain) {
      [...memberNamesOrParentChain._propertyNames.slice()].forEach(name => this.add(name));
    } else {
      memberNamesOrParentChain?.forEach(name => this.add(name));
    }
  }

  /**
   * Adds a property name to the property chain.
   *
   * @param propertyName - The name of the property to add.
   */
  public add(propertyName: string): void {
    if (propertyName) {
      this._propertyNames.push(propertyName);
    }
  }

  /**
   * Adds an indexer to the property chain.
   * @param index - The index to add.
   * @param surroundWithBrackets - Indicates whether to surround the index with brackets. Default is true.
   * @throws Error if the property chain is empty.
   */
  public addIndexer(index: string, surroundWithBrackets = true): void {
    if (this._propertyNames.length === 0) {
      throw new Error('Could not apply an Indexer because the property chain is empty.');
    }
    const lastIndex = this._propertyNames.length - 1;
    const lastPropertyName = this._propertyNames[lastIndex];
    if (surroundWithBrackets) {
      this._propertyNames[lastIndex] = `${lastPropertyName}[${index}]`;
    } else {
      this._propertyNames[lastIndex] = `${lastPropertyName}${index}`;
    }
  }

  /**
   * Returns a string representation of the property chain.
   * The property names are joined together with a dot separator.
   *
   * @returns A string representation of the property chain.
   */
  public toString(): string {
    return this._propertyNames.join('.');
  }

  /**
   * Builds the property path by adding the specified property name to the existing property chain.
   * @param propertyName - The name of the property to add to the chain.
   * @returns The updated property path.
   */
  public buildPropertyPath(propertyName: string): string {
    if (this._propertyNames.length === 0) {
      return propertyName;
    }
    const chain = new PropertyChain(this);
    chain.add(propertyName);
    return chain.toString();
  }
}

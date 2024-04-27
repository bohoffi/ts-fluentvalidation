/**
 * Represents a message formatter that replaces placeholders in a message with provided values.
 */
export class MessageFormatter {
  private _placeholders: Record<string, unknown> = {};
  private readonly propertyName = 'propertyName';
  private readonly propertyValue = 'propertyValue';

  public readonly basePlaceholders = {
    propertyPath: 'propertyPath',
    collectionIndex: 'collectionIndex'
  };

  /**
   * Gets the current placeholders.
   */
  public get placeholders(): Readonly<Record<string, unknown>> {
    return this._placeholders;
  }

  /**
   * Appends or updates an argument to the placeholders.
   * @param key - The key of the argument.
   * @param value - The value of the argument.
   */
  public appendOrUpdateArgument(key: string, value: unknown): void {
    this._placeholders[key] = value;
  }

  /**
   * Appends or updates the property name placeholder.
   * @param propertyName - The property name.
   */
  public appendOrUpdatePropertyName(propertyName: string): void {
    this._placeholders[this.propertyName] = propertyName;
  }

  /**
   * Appends or updates the property value placeholder.
   * @param value - The property value.
   */
  public appendOrUpdatePropertyValue(value: unknown): void {
    this._placeholders[this.propertyValue] = value;
  }

  /**
   * Formats the message with the current placeholders.
   * @param message - The message to format.
   * @returns The formatted message.
   */
  public formatWithPlaceholders(message: string): string {
    let formattedMessage = message;
    for (const key in this._placeholders) {
      formattedMessage = formattedMessage.replace(`{${key}}`, `${this._placeholders[key]}`);
    }
    return formattedMessage;
  }

  /**
   * Resets the placeholders to an empty state.
   */
  public reset(): void {
    this._placeholders = {};
  }
}

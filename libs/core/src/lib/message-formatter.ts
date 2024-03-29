/**
 * Represents a message formatter that is used to format validation error messages.
 */
export type MessageFormatter = {
  /**
   * Appends an argument to the message formatter.
   * @param key - The key of the argument.
   * @param value - The value of the argument.
   */
  appendArgument(key: string, value: unknown): void;

  /**
   * Appends a property name to the message formatter.
   * @param propertyName - The name of the property.
   */
  appendPropertyName(propertyName: string): void;

  /**
   * Appends a property value to the message formatter.
   * @param value - The value of the property.
   */
  appendPropertyValue(value: unknown): void;

  /**
   * Formats the message with placeholders.
   * @param message - The message with placeholders.
   * @returns The formatted message.
   */
  formatWithPlaceholders(message: string): string;
};

/**
 * Creates a message formatter object.
 * @returns The created message formatter.
 */
export function createMessageFormatter(): MessageFormatter {
  const placeholder: Record<string, unknown> = {};
  const defaultPlaceholder = {
    propertyName: 'propertyName',
    propertyValue: 'propertyValue'
  };

  return {
    appendArgument: (key: string, value: unknown) => {
      placeholder[key] = value;
    },
    appendPropertyName: (propertyName: string) => {
      placeholder[defaultPlaceholder.propertyName] = propertyName;
    },
    appendPropertyValue: (value: unknown) => {
      placeholder[defaultPlaceholder.propertyValue] = value;
    },
    formatWithPlaceholders: (message: string) => {
      let formattedMessage = message;
      for (const key in placeholder) {
        formattedMessage = formattedMessage.replace(`{{${key}}}`, `${placeholder[key]}`);
      }
      return formattedMessage;
    }
  };
}

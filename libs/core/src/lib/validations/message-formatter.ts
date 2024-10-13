/**
 * The default placeholders for the validation messages.
 */
export const DEFAULT_PLACEHOLDERS = {
  propertyName: 'propertyName',
  propertyValue: 'propertyValue',
  comparisonValue: 'comparisonValue',
  maxLength: 'maxLength',
  minLength: 'minLength',
  lowerBound: 'lowerBound',
  upperBound: 'upperBound'
};

/**
 * Formats a message with the specified placeholders.
 *
 * @param message - The message to format.
 * @param placeholders - The placeholders to replace in the message.
 * @returns The formatted message.
 */
export function formatMessage(message: string, placeholders: Record<string, unknown>): string {
  return Object.entries(placeholders).reduce((message, [key, value]) => message.replace(`{${key}}`, String(value)), message);
}

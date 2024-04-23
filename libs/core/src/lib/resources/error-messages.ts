type ErrorMessages = {
  // common rules
  EqualRule: string;
  MustRule: string;
  NotEqualRule: string;
  NotNullRule: string;
  NullRule: string;
  // length rules
  EmptyRule: string;
  LengthRule: string;
  MaxLengthRule: string;
  MinLengthRule: string;
  NotEmptyRule: string;
  // number rules
  ExclusiveBetweenRule: string;
  GreaterThanOrEqualRule: string;
  GreaterThanRule: string;
  InclusiveBetweenRule: string;
  LessThanOrEqualRule: string;
  LessThanRule: string;
  // string rules
  MatchesRule: string;
};

const errorMessages: ErrorMessages = {
  // common rules
  EqualRule: '{propertyName} must be equal to {comparisonValue}.',
  MustRule: 'The specified condition was not met for {propertyName}.',
  NotEqualRule: '{propertyName} must not be equal to {comparisonValue}.',
  NotNullRule: '{propertyName} must not be null.',
  NullRule: '{propertyName} must be null.',
  // length rules
  EmptyRule: '{propertyName} must be empty.',
  LengthRule: '{propertyName} must have a minimum length of {minLength} and a maximum length of {maxLength}.',
  MaxLengthRule: '{propertyName} must have a maximum length of {maxLength}.',
  MinLengthRule: '{propertyName} must have a minimum length of {minLength}.',
  NotEmptyRule: '{propertyName} must not be empty.',
  // number rules
  ExclusiveBetweenRule: '{propertyName} must be between {lowerBound} and {upperBound} (exclusive).',
  GreaterThanOrEqualRule: '{propertyName} must be greater than or equal to {comparisonValue}.',
  GreaterThanRule: '{propertyName} must be greater than {comparisonValue}.',
  InclusiveBetweenRule: '{propertyName} must be between {lowerBound} and {upperBound}.',
  LessThanOrEqualRule: '{propertyName} must be less than or equal to {comparisonValue}.',
  LessThanRule: '{propertyName} must be less than {comparisonValue}.',
  // string rules
  MatchesRule: '{propertyName} is not in the correct format.'
};

/**
 * Retrieves an error message based on the provided key or fallback key.
 * If the key is found in the errorMessages object, the corresponding message is returned.
 * If the key is not found, the fallbackKey is used to retrieve the message.
 * If neither the key nor the fallbackKey is found, a default error message is returned.
 *
 * @param key - The key to search for in the errorMessages object.
 * @param fallbackKey - The fallback key to use if the key is not found.
 * @returns The error message corresponding to the key or fallback key, or a default error message.
 */
export const getErrorMessage = (key: string | undefined, fallbackKey: string) =>
  !!key && key in errorMessages
    ? errorMessages[key as keyof ErrorMessages]
    : fallbackKey in errorMessages
    ? errorMessages[fallbackKey as keyof ErrorMessages]
    : '{propertyName} is invalid';

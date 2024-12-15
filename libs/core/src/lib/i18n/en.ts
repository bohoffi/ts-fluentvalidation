const en: Record<string, string> = {
  equals: `'{propertyName}' must equal {comparisonValue}.`,
  minLength: `'{propertyName}' must have a minimum length of {minLength}.`,
  greaterThanOrEquals: `'{propertyName}' must be greater than or equal to {comparisonValue}.`,
  inclusiveBetween: `'{propertyName}' must be between {lowerBound} and {upperBound} inclusively.`,
  isFalse: `'{propertyName}' must be false.`,
  isNull: `'{propertyName}' must be null.`,
  isTrue: `'{propertyName}' must be true.`,
  length: `'{propertyName}' must have a length between (inclusive) {minLength} and {maxLength}.`
};

export { en };

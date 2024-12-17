const en: Record<string, string> = {
  empty: `'{propertyName}' must be empty.`,
  equals: `'{propertyName}' must equal {comparisonValue}.`,
  exclusiveBetween: `'{propertyName}' must be between {lowerBound} and {upperBound} exclusively.`,
  greaterThan: `'{propertyName}' must be greater than {comparisonValue}.`,
  greaterThanOrEquals: `'{propertyName}' must be greater than or equal to {comparisonValue}.`,
  inclusiveBetween: `'{propertyName}' must be between {lowerBound} and {upperBound} inclusively.`,
  isFalse: `'{propertyName}' must be false.`,
  isFalsy: `'{propertyName}' must be falsy.`,
  isNull: `'{propertyName}' must be null.`,
  isTrue: `'{propertyName}' must be true.`,
  isTruthy: `'{propertyName}' must be truthy.`,
  length: `'{propertyName}' must have a length between (inclusive) {minLength} and {maxLength}.`,
  lessThan: `'{propertyName}' must be less than {comparisonValue}.`,
  lessThanOrEquals: `'{propertyName}' must be less than or equal to {comparisonValue}.`,
  matches: `'{propertyName}' must match pattern.`,
  maxLength: `'{propertyName}' must have a maximum length of {maxLength}.`,
  minLength: `'{propertyName}' must have a minimum length of {minLength}.`,
  must: `'{propertyName}' must meet the specified criteria.`,
  mustAsync: `'{propertyName}' must meet the specified criteria.`,
  notEmpty: `'{propertyName}' must not be empty.`,
  notEquals: `'{propertyName}' must not equal {comparisonValue}.`,
  notNull: `'{propertyName}' must not be null.`,
  required: `'{propertyName}' is required.`
};

export { en };

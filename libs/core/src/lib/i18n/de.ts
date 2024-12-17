const de: Record<string, string> = {
  empty: `'{propertyName}' darf nicht leer sein.`,
  equals: `'{propertyName}' muss gleich {comparisonValue} sein.`,
  exclusiveBetween: `'{propertyName}' muss zwischen {lowerBound} und {upperBound} sein (exklusive).`,
  greaterThan: `'{propertyName}' muss größer als {comparisonValue} sein.`,
  greaterThanOrEquals: `'{propertyName}' muss größer oder gleich {comparisonValue} sein.`,
  inclusiveBetween: `'{propertyName}' zwischen {lowerBound} und {upperBound} sein.`,
  isFalse: `'{propertyName}' muss falsch sein.`,
  isFalsy: `'{propertyName}' muss falsy sein.`,
  isNull: `'{propertyName}' muss Null sein.`,
  isTrue: `'{propertyName}' muss wahr sein.`,
  isTruthy: `'{propertyName}' muss truthy sein.`,
  length: `'{propertyName}' muss eine Länge zwischen {minLength} und {maxLength} haben.`,
  lessThan: `'{propertyName}' muss kleiner als {comparisonValue} sein.`,
  lessThanOrEquals: `'{propertyName}' muss kleiner oder gleich {comparisonValue} sein.`,
  matches: `'{propertyName}' weist ein ungültiges Format auf.`,
  maxLength: `'{propertyName}' darf eine maximale Länge von {maxLength} haben.`,
  minLength: `'{propertyName}' muss eine minimale Länge von {minLength} haben.`,
  must: `'{propertyName}' erfüllt nicht die Kriterien.`,
  mustAsync: `'{propertyName}' erfüllt nicht die Kriterien.`,
  notEmpty: `'{propertyName}' darf nicht leer sein.`,
  notEquals: `'{propertyName}' darf nicht {comparisonValue} sein.`,
  notNull: `'{propertyName}' darf nicht Null sein.`,
  required: `'{propertyName}' ist ein Pflichtfeld.`
};

export { de };

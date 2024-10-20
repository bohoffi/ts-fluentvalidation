---
keyword: 'ConfiguringValidationsOverrideMessage'
---

A validations message can be ovewritten in two ways.

As a validations parameter - all built-in validations support a message as the last parameter:

```typescript
const validator = createValidator<Person>()
  .ruleFor('lastName', notEmpty(`Please ensure that you have entered your 'lastName'.`))
  .ruleFor('age', greaterThanOrEquals(18, 'The persons age must be at least 18.'));
```

Using the `withMessage()` function of a validation.

```typescript
const validator = createValidator<Person>().ruleFor(
  'lastName',
  notEmpty().withMessage(`Please ensure that you have entered your 'lastName'.`)
);
```

Note that custom error messages can contain placeholders for special values such as `{propertyName}` - which will be replaced in this example with the name of the property being validated. This means the above error message could be rewritten as:

```typescript
const validator = createValidator<Person>().ruleFor(
  'lastName',
  notEmpty().withMessage(`Please ensure that you have entered your '{propertyName}'.`)
);
```

...and the value `lastName` will be inserted.

## Placeholders

As shown in the example above, the message can contain placeholders for special values such as `{propertyName}` - which will be replaced at runtime. Each built-in validation has its own list of placeholders.

The placeholder available in all validations is:

- `{propertyName}` - Name of the property being validated
- `{propertyValue}` - Value of the property being validated

Used in comparison validations (`equals()`, `notEquals()`, `greaterThan()`, `greaterThanOrEquals()`, etc.):

- `{comparisonValue}` - Value to compare against

Used in length validations (`length()`, `minLength()`, `maxLength()`):

- `{minLength}` - Minimum length
- `{maxLength}` - Maximum length

Used in range validations (`exclusiveBetween()`, `inclusiveBetween()`):

- `{lowerBound}` - Lower bound
- `{upperBound}` - Upper bound

For a complete list of error message placeholders used see the `*BuildingValidationsBuiltInValidations` page. Each built-in validation has its own supported placeholders.

It is also possible to use your own custom placeholders in the validation message. This can be done by using the `withMessage()` function in combination with the `withPlaceholder()` function:

```typescript
const validator = createValidator<Person>().ruleFor(
  'lastName',
  notEmpty().withMessage('This message references some constant values: {arg_1} {arg_2}').withPlaceholder('arg_1', 'hello').withPlaceholder('arg_2', 5);
);
//Result would be "This message references some constant values: hello 5"
```

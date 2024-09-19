---
keyword: 'ConfiguringRulesOverrideMessage'
---


You can override the default error message for a rule by calling the `withMessage` function on a rule.

```typescript
validator
  .ruleFor(person => person.name)
  .notNull()
  .withMessage('Please ensure you have entered a name');
```

Note that custom error messages can contain certain placeholders such as `{propertyName}` - which will be replaced in this example with the name of the property being validated. This means the above error message could be re-written as:

```typescript
validator
  .ruleFor(person => person.name)
  .notNull()
  .withMessage('Please ensure you have entered a {propertyName}');
```

...and the value `name` will be inserted.

## Placeholders

As shown in the example above, the message can contain placeholders for special values such as the `{propertyName}` and `{propertyValue}` - which will be replaced at runtime. Each built-in rule has its own list of placeholders.

The placeholders used in all rules are:

- `{propertyName}`: name of the property being validated
- `{propertyValue}`: value of the property being validated

Used in comparison rules (such as `equal`, `notEqual`, `greaterThan`, `lessThan`, etc.):

- `{comparisonValue}`: value that the property should be compared to

Used in bounding rules only:

- `lowerBound` - lower end of a range
- `upperBound` - upper end of a range

Used in length rules only:

- `{maxLength}` - maximum allowed length
- `{minLength}` - minimum allowed length

For a complete list of error message placeholders see the `*BuildingRulesBuiltInRules` page.



The default rule error message contains the property name being validated. For example, if you'd define a validation like this:

```typescript
validator.ruleFor(person => person.name).notNull();
```

...then the default error message would be `name must not be null`.

Instead of `*ConfiguringRulesOverrideMessage` you could also just replace the property name by calling the `withName` function:

```typescript
validator
  .ruleFor(person => person.name)
  .notNull()
  .withName('Person name');
```

...which would result in the message being `Person name must not be null`.

Note that this only replaces the property name - `{propertyName}` placeholder mentioned in `*ConfiguringRulesOverrideMessage`. Inspecting the `failures` array of the `ValidationResult` will still show the original property name assigned to the failure.

If your validator contains validations for several properties you can limit execution to only validate specific properties by passing a configuration object conatining the `includeProperties` property to the `validate` function:

```typescript
// Validator definition
const personValidator = createValidator<Person>().ruleFor('lastName', notEmpty()).ruleFor('age', greaterThanOrEqualTo(18));

personValidator.validate(person, config => {
  strategy.includeProperties = ['lastName'];
});
```

In the example above only the validation for the `lastName` property will be executed.

You can define multiple inclusions like:

```typescript
personValidator.validate(person, config => {
  config.includeProperties = ['lastName', 'age'];
});
```

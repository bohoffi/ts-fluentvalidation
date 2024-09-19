

If your validator contains rules for several properties you can limit execution to only validate specific properties by using the `includeProperties` function:

```typescript
// Validator definition
export class PersonValidator extends AbstractValidator<Person> {
  constructor() {
    super();
    this.ruleFor('name').notEmpty();
    this.ruleFor('age').greaterThanOrEqualTo(18);
  }
}
```

```typescript
var validator = new PersonValidator();
validator.validate(person, strategy => {
  strategy.includeProperties('name');
  // results in the same as using the property expression
  strategy.includeProperties(p => p.name);
});
```

In the example above only the rule for the `name` property will be executed.

You can define multiple inclusions like:

```typescript
validator.validate(person, strategy => {
  strategy.includeProperties('name', 'age');
  // results in the same as using the property expressions
  strategy.includeProperties(
    p => p.name,
    p => p.age
  );
});
```

> **Note**
> Restriction for nested properties becomes available with the implementation of [#39 - `includeProperties` to restrict validation to nested properties](https://github.com/bohoffi/ts-fluentvalidation/issues/39)

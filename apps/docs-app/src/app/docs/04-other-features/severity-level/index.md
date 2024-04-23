# {{ NgDocPage.title }}

Given the following example that validates a `Person` model:

```typescript
export class PersonValidator extends AbstractValicator<Person> {
  constructor() {
    super();
    this.ruleFor(p => p.name).notEmpty();
    this.ruleFor(p => p.age).greaterThanOrEqualTo(18);
  }
}
```

By default, if these rules fail they will have a severity of `Error`. This can be changed by calling the `withSeverity()` function. For Example, if we wanted a missing name to be identified as a warning instead of an error then we could modify the above line to:

```typescript
this.ruleFor(p => p.name)
  .notEmpty()
  .withSeverity('Warning');
```

You can also use a callback instead, which gives you access to the model itself, the property being validated and the validation context:

```typescript
this.ruleFor(p => p.name)
  .notEmpty()
  .withSeverity((person: Person, value: string, context: ValidationContext<Person>) =>
    person.age && value && !context.failues.length ? 'Warning' : 'Error'
  );
```

In this case, the `ValidationResult` would still have an `isValid` result of `false`. However, in the list of `errors`, the `ValidationFailure` associated with this field will have its `severity` property set to `Warning`:

```typescript
const personValidator = new PersonValidator();
const result = personValidator.validate({ name: '', age: 15 });
result.errors.forEach(failure => {
  console.log(`Property: ${failure.propertyName} - Severity: ${failure.severity}`);
});
```

The output would be:

```bash
Property: name - Severity: Warning
Property: age - Severity: Error
```

By default, the severity level of every validation is `Error`. Available options are `Error`, `Warning` or `Info`.

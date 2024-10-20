---
keyword: Severity
---

Given the following example that validates a `Person` object:

```typescript
const personValidator = createValidator<Person>().ruleFor('lastName', notNull()).ruleFor('age', greaterThanOrEquals(18));
```

By default, if these validations fail they will have a severity of `'Error'`. This can be changed by calling the `withSeverity()` function. For example, if we wanted a missing last name to be identified as a warning instead of an error then we could modify the above line to:

```typescript
.ruleFor('lastName', notNull()).withSeverity('Warning')
```

Alternatively you can use one of the other 2 overloads of the `withSeverity()` function which will take the model and the value into account:

```typescript
.ruleFor('lastName', notNull()).withSeverity(person => 'Warning')

.ruleFor('lastName', notNull()).withSeverity((person, lastName) => 'Warning')
```

In this case, the `ValidationResult` would still have an `isValid` result of `false`. However, in the array of `failures`, the `ValidationFailure` associated with this field will have its `severity` property set to `'Warning'`:

```typescript
const result = personValidator.validate({ lastName: null, age: 6 });
result.failures.forEach(failure => console.log(`Property: ${failure.propertyName} Severity: ${failure.severity}`));
```

The output would be:

```shell
Property: lastName Severity: Warning
Property: age Severity: Error
```

By default, the severity level of every validation rule is `'Error'`. Available options are `'Error'`, `'Warning'`, or `'Info'`.

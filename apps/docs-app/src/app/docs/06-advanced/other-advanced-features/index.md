---
keyword: OtherAdvancedFeatures
---

These features are not normally used in day-to-day use but provide some additional extensibility points that may be useful under some circumstances.

## `preValidate()`

If you need to run specific code every time a validator is invoked, you can do this by using the `preValidate()` function. This function takes a `ValidationContext` as well as a `ValidationResult` which you can use to customize the validation process.

The function should return `true` if validation should continue or false to immediately abort. Any modifications that you made to the ValidationResult will be returned to the user.

```typescript
const personValidator = createValidator<Person>()
  .ruleFor('lastName', notEmpty())
  .preValidate((validationContext: ValidationContext<Person>, validationResult: ValidationResult) => {
    const modelToValidate = validationContext.modelToValidate;

    if (modelToValidate.firstName === 'John' && modelToValidate.lastName === 'Doe') {
      validationResult.addFailures({
        message: 'Pre-validation failed for John Doe',
        propertyName: 'firstName',
        severity: 'Error'
      });
      return false;
    }
    return true;
  });
```

---
keyword: Angular
---

To combine the power of `@ts-fluentvalidation` with Angulars reactive forms you can construct Angular validator right from your validators.

## Form control validators

To create a form control validator using your existing fluent validator you can either use `toAsyncValidatorFn` or `toValidatorFn` depending on the fact if your validation contain async validations or not:

```typescript
const personValidator = createValidator<Person>().ruleFor('firstName', equals('John'));

const firstNameControl = new FormControl<string>('Jane', toValidatorFn(personValidator, 'firstName'));

console.log(control.errors); // { firstName: [`'firstName' must equal John.`] }
```

{{ NgDocActions.demo("ControlValidatorComponent") }}

The functions to create Angular validators build upon the type system - this means the `toAsyncValidatorFn`/`toValidatorFn` will accept existing validation keys only as their second parameter.
The validator created by these two functions works like most of the built-in Angular validators which means that they will ignore empty control values.

> **Warning**
> Keeping that in mind means that validations like `empty` and `required` will not work. You should rely on the built-in required validator instead.

### Cascading

Per default a form control validator created uses `Continue` as `CascadeMode`. This can be overwritten using the thrid parameter of the `toAsyncValidatorFn`/`toValidatorFn` function.

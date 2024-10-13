To define a validator for a model you can use the `createValidator` function:

```typescript
interface Person {
  lastName: string;
  age: number;
}

const personValidator = createValidator<Person>();
```

## Define validations

While creating the validator you can start to define validations for the models properties by passing a property name to the `ruleFor` function. The following example shows how to validate that the persons lastName should not be an empty string:

```typescript
createValidator<Person>().ruleFor('lastName', notEmpty());
```

> **Warning**
> Each call of `ruleFor` updates the validators set of validations and failed validations will result in expected output **but** you won't get the full type support due to the functional approach chosen if you are **not chaining** these calls:

```typescript
const validator = createValidator<Person>().ruleFor('lastName', notEmpty());
// this will add validation for the age property to the validator
validator.ruleFor('age', greaterThanOrEquals(18));
```

...which will result in the following type:

```typescript
const validator: Validator<
  Person,
  {
    readonly lastName: Validation<string, Person>[];
  }
>;
```

While chaining the `ruleFor` calls like:

```typescript
const validator = createValidator<Person>().ruleFor('lastName', notEmpty()).ruleFor('age', greaterThanOrEquals(18));
```

...will result in the following type:

```typescript
const validator: Validator<
  Person,
  {
    readonly lastName: Validation<string, Person>[];
    readonly age: Validation<number, Person>[];
  }
>;
```

## Validation

To validate an object using a validator call the validators `validate` function passing the object as the parameter:

```typescript
const person: Person = {
  lastName: '',
  age: 0
};

const result: ValidationResult = personValidator.validate(person);
```

`ValidationResult` returned by the `validate` function exposes the following properties:

- `isValid` - a flag indicating the validation succeeded
- `failures` - an array of `ValidationFailure` containing details about failed validations

The following code would log all errors to the console:

```typescript
const person: Person = {
  lastName: '',
  age: 0
};

const result: ValidationResult = personValidator.validate(person);

if (!result.isValid) {
  result.failures.forEach(error => console.error(`${error.propertyName} failed validation. Error was:`, error.message));
}
```

You can also call `toString()` on the `ValidationResult` to combine all error messages into a single string. By default, the messages will be separated with new lines, but if you want to customize this behaviour you can pass a different separator character to `toString()`.

```typescript
const result = personValidator.validate(person);
const allMessages: string = result.toString('~');
```

## Chaining validations

It's possible to assign multiple validations to an objects property using chaining:

```typescript
personValidator.ruleFor('lastName', notEmpty(), notEquals<string, Person>('foo'));
```

This would ensure that the lastName is neither empty nor equals the string 'foo'.

## Throwing errors

Instead of returning a `ValidationResult` you can alternatively tell `@ts-fluentvalidation/core` to throw an error if validation fails by using the `validateAndThrow()` / `validateAndThrowAsync()` function:

```typescript
const personValidator = createValidator<Person>().ruleFor('lastName', notEmpty());
personValidator.validateAndThrow({ lastName: '' });
```

This throws a `ValidationError` which contains the validation failures in the `failures` property.

The `validateAndThrow()` function is a helpful wrapper around `@ts-fluentvalidation/core`'s config API and is the equivalent of doing the following:

```typescript
// will set the behaviour validator wide --> each subsequent `validate()` call will throw on failure
// except when explicitly overwritten by the validate call itself
createValidator<Person>({ throwOnFailures: true });

// will set the behaviour for the specific validate call
personValidator.validate({ lastName: '' }, config => {
  config.throwOnFailures = true;
});
```

If you need to combine throwing an error with validating individual properties you can combine both config values using this syntax:

```typescript
personValidator.validate({ lastName: '' }, config => {
  config.throwOnFailures = true;
  config.includeProperties = ['lastName'];
});
```

## Complex Properties

### Using `must()` / `mustAsync()`

You can combine `ruleFor()` with `must()` / `mustAsync()` when you want to create a validation for a complex property:

```typescript
export interface Person {
  address: Address;
}

export interface Address {
  city: string;
}
```

```typescript
const personValidator = createValidator<Person>().ruleFor(
  'address',
  must<Address, Person>(address => address.city !== '', 'City must not be empty.')
);
```

Given the above validator and running the following validation:

```typescript
const result = personValidator.validate({
  address: {
    city: ''
  }
});
```

...will result with 1 failure for the address:

```typescript
{
  propertyName: 'address',
  message: 'City must not be empty.',
  attemptedValue: '',
  severity: 'Error'
}
```

### Using `setValidator`

Reusing the models from above:

```typescript
export interface Person {
  address: Address;
}

export interface Address {
  city: string;
}
```

You can create a dedicated validator for the Address type and assign it using the `setValidator()` function like:

```typescript
const addressValidator = createValidator<Address>().ruleFor('city', notEmpty());

const validator = createValidator<Person>().ruleFor('address', setValidator(addressValidator));
```

> **Warning**
> If your child validator contains asynchronous validations or asynchronous conditions, it's important that you _always_ call `setValidatorAsync()` function on your validator and never `setValidator()`. If you call `setValidator()`, then a `AsyncValidatorSetSynchronouslyError` will be thrown.

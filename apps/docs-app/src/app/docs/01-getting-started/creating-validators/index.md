# {{ NgDocPage.title }}

To define a validator for a model you can use the `createValidator` function:

```typescript
interface Person {
  name: string;
  age: number;
}

const personValidator = createValidator<Person>();
```

## Define validations

While creating the validator you can start to define validations for the models properties by passing a property name to the
`ruleFor` function. The following example shows how to validate that the persons name should not be an empty string:

```typescript
createValidator<Person>().ruleFor('name', notEmpty());
```

> **Warning**
> Each call of `ruleFor` updates the validators set of validations and failed validations will result in expected output **but** you won't get the full type support due to the functional approach chosen if you are **not chaining** these calls:

```typescript
const validator = createValidator<Person>().ruleFor('name', notEmpty());
// this will add validation for the age property to the validator
validator.ruleFor('age', greaterThanOrEquals(18));
```

...which will result in the following type:

```typescript
const validator: Validator<
  Person,
  {
    readonly name: ValidationFnArray<Person, 'name'>;
  }
>;
```

While chaining the `ruleFor` calls like:

```typescript
const validatorOne = createValidator<Person>().ruleFor('name', notEmpty()).ruleFor('age', greaterThanOrEquals(18));
```

...will result in the following type:

```typescript
const validatorOne: Validator<
  Person,
  {
    readonly name: ValidationFnArray<Person, 'name'>;
    readonly age: ValidationFnArray<Person, 'age'>;
  }
>;
```

## Validation

To validate an object using a validator call the validators `validate` function passing the object as the parameter:

```typescript
const person: Person = {
  name: '',
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
  name: '',
  age: 0
};

const result: ValidationResult = personValidator.validate(person);

if (!result.isValid) {
  result.failures.forEach(error => console.error(`${error.propertyName} failed validation. Error was:`, error.message));
}
```

## Chaining validations

It's possible to assign multiple validations to an objects property using chaining:

```typescript
personValidator.ruleFor('name', notEmpty(), notEquals<string, Person>('foo'));
```

This would ensure that the name is neither empty nor equals the string 'foo'.

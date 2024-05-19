# {{ NgDocPage.title }}

There are several ways to create a custom, reusable rule. The recommended way is to make use of the `MustRule` to write a custom validation function.

For these examples, we’ll imagine a scenario where you want to create a reusable validator that will ensure an array contains fewer than 10 items.

## MustRule

The simplest way to implement a custom rule is by using the `must()` function, which internally uses the `MustRule`.

Imagine we have the following model:

```typescript
export class Person {
  public pets: Pet[] = [];
}
```

To ensure our array property contains fewer than 10 items, we could do this:

```typescript
export class PersonValidator extends AbstractValidator<Person> {
  constructor() {
    super();
    this.ruleFor(p => p.pets)
      .must(pets => pets.length < 10)
      .withMessage('The array must contain fewer than 10 items');
  }
}
```

To make this logic reusable, we can extract it into a function:

```typescript
export function arrayMustContainFewerThan<T, P extends Array<any>>(num: number): RulePredicate<T, P> {
  return array => array.length < num;
}
```

We created a function using a generic contraint to ensure it is only applicable to array properties. Inside the function, we returned a `RulePredicate` which is the parameter type of the `must()` function. We also pass in the number of items for comparison as a parameter. Our rule definition can now be rewritten to use this function:

```typescript
this.ruleFor(p => p.pets)
  .must(arrayMustContainFewerThan(10))
  .withMessage('The array must contain fewer than 10 items');
```

## Custom message placeholders

We can extend the above example to include a more useful error message. At the moment, our custom rule always returns the message "The array must contain fewer than 10 items" if validation fails. Instead, let's change the message so it returns "pets must contain fewer than 10 items." This can be done by using custom message placeholders. `@ts-fluentvalidation/core` supports several message placeholders by default including `{propertyName}` and `{propertyValue}` (see `*BuildingRulesBuiltInRules` page), but we can also add our own.

We need to modify our function slightly to use further parameters of our `RulePredicate` which include the `ValidationContext` instance. This context provides additional information and methods we can use when performing validation:

```typescript
export function arrayMustContainFewerThan<T, P extends Array<any>>(num: number): RulePredicate<T, P> {
  return (array, rootObject, context) => {
    context.messageFormatter.appendArgument('maxElements', num);
    return array.length < num;
  };
}
```

Note that the predicate that we're using now accepts 3 parameters: the property value itself, the root (parent) object and the context. We use the context to add a custom message replacement value of `maxElements` and set its value to the number passed to the method. We can now use this placeholder `{maxElements}` within the call to `withMessage`:

```typescript
this.ruleFor(p => p.pets)
  .must(arrayMustContainFewerThan(10))
  .withMessage('{propertyName} must contain fewer than {maxElements} items.');
```

The resulting message will now be `pets must contain fewer than 10 items.`. We could even extend it further to include the number of elements that the array contains like this:

```typescript
export function arrayMustContainFewerThan<T, P extends Array<any>>(num: number): RulePredicate<T, P> {
  return (array, rootObject, context) => {
    context.messageFormatter.appendArgument('maxElements', num);
    context.messageFormatter.appendArgument('totalElements', array.length);
    return array.length < num;
  };
}

...

this.ruleFor(p => p.pets)
  .must(arrayMustContainFewerThan(10))
  .withMessage('{propertyName} must contain fewer than {maxElements} items. The array contains {totalElements} elements.');
```

## Writing a Custom Rule

If you need more control of the validation process than is available with the `must`, you can write a custom rule using the `custom` function. This function allows you to manually create the `ValidationFailure` instance associated with the validation error. Usually, the library does this for you, so it is more verbose than using `must`.

```typescript
export class PersonValidator extends AbstractValidator<Person> {
  constructor() {
    super();
    this.ruleFor(p => p.pets).custom((array, context) => {
      if (array.length > 10) {
        context.addFailure('The array must contain 10 items or fewer');
      }
    });
  }
}
```

The advantage of this approach is that it allows you to return multiple errors for the same rule (by calling the `ValidationContext.addfailure` function multiple times). In the above example, the property name in the generated error will be infered as "pets", although this could be overridden by calling a different overload of `addFailure`:

```typescript
context.addFailure('someOtherProperty', 'The array must contain 10 items or fewer');
// or you can instantiate the ValidationFailure directly
context.addFailure(new ValidationFailure('someOtherProperty', 'The array must contain 10 items or fewer'));
```

As before, this could be wrapped in a function to simplify the consuming code:

```typescript
export function arrayMustContainFewerThan<T, P extends Array<any>>(num: number): CustomRulePredicate<T, P> {
  return (array, context) => {
    if (array.length > 10) {
      context.addFailure('The array must contain 10 items or fewer');
    }
  };
}
```

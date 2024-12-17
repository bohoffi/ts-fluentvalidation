---
keyword: Localization
---

Out of the box `@ts-fluentvalidation/core` provides validation messages for the built-in validations for a defined set of languages. The default language used English (language code `en`).

Validation messages are resolved using the combination of the language code - e.g. `en` - and the validations error code - e.g. `equals`.

A custom message used while setting up the validator won't be affected by localization.

## Setting the language to use

Setting the language to use done quickly by calling the `I18n.setLanguage` function. For information about the languages supported by this library please have a look into [the repository](https://github.com/bohoffi/ts-fluentvalidation/blob/develop/libs/core/src/lib/i18n/i18n.ts).

```typescript
i18n.setLanguage('en');
```

> **Warning**
> If you try to set a language which isn't available - adding your own is described down below - the library will throw an error.

## Overwriting validation specific message

If the library already offers a localized set for your chosen language but you want to overwrite a specific validations message you can do so by using the `I18n.setMessage` function:

```typescript
// instead of repeating you custom message
// default message is: `'{propertyName}' must have a length between (inclusive) {minLength} and {maxLength}.`
const personValidator = createValidator<Person>()
  .ruleFor('firstName', length(4, 4, `'{propertyName}' must have a length of {minLength}.`))
  .ruleFor('lastName', length(3, 3, `'{propertyName}' must have a length of {minLength}.`));

// set as default
i18n.setMessage('length', `'{propertyName}' must have a length of {minLength}.`);

// use without boilerplate
const personValidator = createValidator<Person>().ruleFor('firstName', length(4, 4)).ruleFor('lastName', length(3, 3));
```

## Supporting custom error codes

If you're using custom error codes resolving validation message will result in `Validation failed` by default.

```typescript
const personValidator = createValidator<Person>().ruleFor('lastName', notEmpty().withErrorCode('ERR123'));

result.failures.forEach(failure => console.log(`Property: ${failure.propertyName} Message: ${failure.message}`));

// output will be
Property: lastName Error Code: Validation failed
```

To add a custom validation message for your specific error code you can use the `I18n.addMessage` function:

```typescript
i18n.addMessage('ERR123', 'Fatal Custom');

const personValidator = createValidator<Person>().ruleFor('lastName', notEmpty().withErrorCode('ERR123'));

result.failures.forEach(failure => console.log(`Property: ${failure.propertyName} Message: ${failure.message}`));

// output will be
Property: lastName Error Code: Fatal Custom
```

## Adding a language

If the language you're looking for isn't officially support yet you can still add it yourself during runtime using the `I18n.addLanguage` function:

```typescript
i18n.addLanguage('foo', {
  equals: 'Should bar',
  required: 'Has to foo bar'
});
```

Afterwards you set you language as described above:

```typescript
i18n.setLanguage('foo');
```

> **Warning**
> Be sure to add a minimum of messages defined by the validations you use in your validators.

Feel free to add your language by opening an [issue](https://github.com/bohoffi/ts-fluentvalidation/issues/new?assignees=&labels=&projects=&template=Feature_request.md).

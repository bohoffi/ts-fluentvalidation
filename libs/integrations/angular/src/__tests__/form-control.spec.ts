import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { createValidator, equals, minLength, mustAsync } from '@ts-fluentvalidation/core';
import { toAsyncValidatorFn, toValidatorFn } from '../lib/form-control';

interface Person {
  firstName: string;
  lastName: string;
  age: number;
  dateOfBirth: Date;
}

describe(toValidatorFn.name, () => {
  const personValidator = createValidator<Person>().ruleFor('firstName', equals('John')).ruleFor('lastName', equals('Doe'), minLength(4));

  it('should return null when the control value is empty', () => {
    const control = new FormControl<string>('');

    const validatorFn = toValidatorFn(personValidator, 'firstName');
    const result = validatorFn(control);

    expect(result).toBeNull();
  });

  it('should return null when the validation passes', () => {
    const control = new FormControl<string>('John');

    const validatorFn = toValidatorFn(personValidator, 'firstName');
    const result = validatorFn(control);

    expect(result).toBeNull();
  });

  it('should return an object with the validation errors when the validation fails', () => {
    const control = new FormControl<string>('Jane');

    const validatorFn = toValidatorFn(personValidator, 'firstName');
    const result = validatorFn(control);

    expect(result).toEqual({
      equals: `'firstName' must equal John.`
    });
  });

  it('should return an object with all validation errors when the validation fails', () => {
    const control = new FormControl<string>('Don');

    const validatorFn = toValidatorFn(personValidator, 'lastName');
    const result = validatorFn(control);

    expect(result).toEqual({
      equals: `'lastName' must equal Doe.`,
      minLength: `'lastName' must have a minimum length of 4.`
    });
  });

  it('should fail fast with CascadeMode set to `Stop`', () => {
    const control = new FormControl<string>('Don');

    const validatorFn = toValidatorFn(personValidator, 'lastName', 'Stop');
    const result = validatorFn(control);

    expect(result).toEqual({
      equals: `'lastName' must equal Doe.`
    });
  });

  it('should work when passed to control constructor', () => {
    const control = new FormControl<string>('Jane', toValidatorFn(personValidator, 'firstName'));

    expect(control.errors).toEqual({
      equals: `'firstName' must equal John.`
    });
  });
});

describe(toAsyncValidatorFn.name, () => {
  const personValidator = createValidator<Person>()
    .ruleFor(
      'firstName',
      mustAsync(firstName => Promise.resolve(firstName === 'John'), "'firstName' must equal John.")
    )
    .ruleFor(
      'lastName',
      mustAsync(lastName => Promise.resolve(lastName === 'Doe'), "'lastName' must equal Doe."),
      mustAsync(lastName => Promise.resolve(lastName.length >= 4), "'lastName' must have a minimum length of 4.")
    );

  it('should return null when the control value is empty', async () => {
    const control = new FormControl<string>('');

    const asyncValidatorFn = toAsyncValidatorFn(personValidator, 'firstName');
    const result = await asyncValidatorFn(control);

    expect(result).toBeNull();
  });

  it('should return null when the validation passes', async () => {
    const control = new FormControl<string>('John');

    const asyncValidatorFn = toAsyncValidatorFn(personValidator, 'firstName');
    const result = await asyncValidatorFn(control);

    expect(result).toBeNull();
  });

  it('should return an object with the validation errors when the validation fails', async () => {
    const control = new FormControl<string>('Jane');

    const asyncValidatorFn = toAsyncValidatorFn(personValidator, 'firstName');
    const result = await asyncValidatorFn(control);

    expect(result).toEqual({
      mustAsync: `'firstName' must equal John.`
    });
  });

  it('should return an object with all validation errors when the validation fails', async () => {
    const control = new FormControl<string>('Don');

    const asyncValidatorFn = toAsyncValidatorFn(personValidator, 'lastName');
    const result = await asyncValidatorFn(control);

    expect(result).toEqual({
      mustAsync: `'lastName' must have a minimum length of 4.`
    });
  });

  it('should fail fast with CascadeMode set to `Stop`', async () => {
    const control = new FormControl<string>('Don');

    const validatorFn = toAsyncValidatorFn(personValidator, 'lastName', 'Stop');
    const result = await validatorFn(control);

    expect(result).toEqual({
      mustAsync: `'lastName' must equal Doe.`
    });
  });

  it('should work when passed to control constructor', fakeAsync(() => {
    const control = new FormControl<string>('Jane', {
      asyncValidators: toAsyncValidatorFn(personValidator, 'firstName')
    });

    control.markAsTouched();
    tick();

    expect(control.errors).toEqual({
      mustAsync: `'firstName' must equal John.`
    });
  }));
});

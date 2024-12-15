import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toAsyncValidatorFn, toValidatorFn } from '@ts-fluentvalidation/angular';
import { createValidator, equals, length, mustAsync } from '@ts-fluentvalidation/core';

interface Person {
  firstName: string;
  lastName: string;
}

interface PersonForm {
  firstName: FormControl<string | undefined>;
  lastName: FormControl<string | undefined>;
}

const personValidator = createValidator<Person>()
  .ruleFor('firstName', equals('John'), length(4, 4))
  .ruleFor(
    'lastName',
    equals('Doe'),
    mustAsync(lastName => Promise.resolve(lastName.length === 3), 'Last name must have a length of 3.')
  );

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './control-validator.component.html',
  styleUrl: './control-validator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlValidatorComponent {
  protected readonly form = new FormGroup<PersonForm>({
    firstName: new FormControl<string | undefined>('', {
      nonNullable: true,
      validators: toValidatorFn(personValidator, 'firstName')
    }),
    lastName: new FormControl<string | undefined>('', {
      nonNullable: true,
      asyncValidators: toAsyncValidatorFn(personValidator, 'lastName')
    })
  });
}

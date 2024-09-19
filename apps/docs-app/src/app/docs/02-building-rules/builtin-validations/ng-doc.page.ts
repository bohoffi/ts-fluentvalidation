import { NgDocPage } from '@ng-doc/core';
import BuildingValidations from '../ng-doc.category';

interface ValidationCategory {
  title: string;
  description: string;
  validations: Validation[];
}

interface Validation {
  name: string;
  description: string;
  example: string;
  exampleErrorMessage?: string;
  parameters?: {
    name: string;
    description: string;
  }[];
}

const validationCategories: ValidationCategory[] = [
  {
    title: 'Common',
    description: 'Common rules that can be used with any type of value.',
    validations: [
      {
        name: 'equals',
        description: 'Checks if a value equals a specified comparison value.',
        example: "validator.ruleFor('name', equals<string, Person>('John'))",
        exampleErrorMessage: '*Value must equal John.*',
        parameters: [
          {
            name: '`comparisonValue`',
            description: 'The value to compare against.'
          }
        ]
      },
      {
        name: 'isFalsy',
        description: 'Checks if a value is falsy.',
        example: "validator.ruleFor('name', isFalsy())",
        exampleErrorMessage: '*Value must be falsy.*'
      },
      {
        name: 'isNull',
        description: 'Checks if a value is null.',
        example: "validator.ruleFor('name', isNull())",
        exampleErrorMessage: '*Value must be null.*'
      },
      {
        name: 'isTruthy',
        description: 'Checks if a value is truthy.',
        example: "validator.ruleFor('name', isTruthy())",
        exampleErrorMessage: '*Value must be truthy.*'
      },
      {
        name: 'must',
        description: 'Checks the value against a given predicate.',
        example: "validator.ruleFor('name', must(name => name.startsWith('J')))",
        exampleErrorMessage: '*Value must meet the specified criteria.*',
        parameters: [
          {
            name: '`predicate`',
            description: 'The predicate to check against.'
          }
        ]
      },
      {
        name: 'notEquals',
        description: 'Checks if a value is not equal to a specified comparison value.',
        example: "validator.ruleFor('name', notEquals<string, Person>('John'))",
        exampleErrorMessage: '*Value must not equal John.*',
        parameters: [
          {
            name: '`comparisonValue`',
            description: 'The value to compare against.'
          }
        ]
      },
      {
        name: 'notNull',
        description: 'Checks if a value is not null.',
        example: "validator.ruleFor('name', notNull())",
        exampleErrorMessage: '*Value must not be null.*'
      },
      {
        name: 'required',
        description: 'Checks if a value is neither nullish nor empty.',
        example: "validator.ruleFor('name', required())",
        exampleErrorMessage: '*Value is required.*'
      }
    ]
  },
  {
    title: 'Length',
    description: 'Rules that validate the length of a value. The value must satisfy the constraint `{ length: number; }`',
    validations: [
      {
        name: 'empty',
        description: 'Checks if a values length is 0.',
        example: "validator.ruleFor('name', empty())",
        exampleErrorMessage: '*Value must be empty.*'
      },
      {
        name: 'length',
        description: 'Checks if a values length is between (inclusive) the specified minimum and maximum.',
        example: "validator.ruleFor('name', length(3, 5))",
        exampleErrorMessage: '*Value must have a length between (inclusive) 3 and 5..*',
        parameters: [
          {
            name: '`minLength`',
            description: 'The minimum length.'
          },
          {
            name: '`maxLength`',
            description: 'The maximum length.'
          }
        ]
      },
      {
        name: 'maxLength',
        description: 'Checksif the values length is less than or equal to the specified maximum.',
        example: "validator.ruleFor('name', maxLength(5))",
        exampleErrorMessage: '*Value must have a maximum length of 5.*',
        parameters: [
          {
            name: '`maxLength`',
            description: 'The maximum length.'
          }
        ]
      },
      {
        name: 'minLength',
        description: 'Checks  if the values length is greater than or equal to the specified minimum.',
        example: "validator.ruleFor('name', minLength(5))",
        exampleErrorMessage: '*Value must have a minimum length of 5.*',
        parameters: [
          {
            name: '`minLength`',
            description: 'The minimum length.'
          }
        ]
      },
      {
        name: 'notEmpty',
        description: 'Checks if a value is not empty.',
        example: "validator.ruleFor('name', notEmpty())",
        exampleErrorMessage: '*Value must not be empty.*'
      }
    ]
  },
  {
    title: 'Number',
    description: 'Rules that validate numeric values.',
    validations: [
      {
        name: 'exclusiveBetween',
        description: 'Checks if the value is between the specified bounds exclusively.',
        example: "validator.ruleFor('age', exclusiveBetween(18, 65))",
        exampleErrorMessage: '*Value must be between 18 and 65 exclusively.*',
        parameters: [
          {
            name: '`lowerBound`',
            description: 'The lower bound.'
          },
          {
            name: '`upperBound`',
            description: 'The upper bound.'
          }
        ]
      },
      {
        name: 'greaterThanOrEquals',
        description: 'Checks if the value is greater than or equal to the specified value.',
        example: "validator.ruleFor('age', greaterThanOrEquals(18))",
        exampleErrorMessage: '*Value must be greater than or equal to 18.*',
        parameters: [
          {
            name: 'comparisonValue`',
            description: 'The value to compare against.'
          }
        ]
      },
      {
        name: 'greaterThan',
        description: 'Checks if the value is greater than the specified value.',
        example: "validator.ruleFor('age', greaterThan(18))",
        exampleErrorMessage: '*Value must be greater than 18.*',
        parameters: [
          {
            name: '`comparisonValue`',
            description: 'The value to compare against.'
          }
        ]
      },
      {
        name: 'inclusiveBetween',
        description: 'Checks  if the value is inclusively between the specified bounds',
        example: "validator.ruleFor('age', inclusiveBetween(18, 65))",
        exampleErrorMessage: '*Value must be between 18 and 65 inclusively.*',
        parameters: [
          {
            name: '`lowerBound`',
            description: 'The lower bound.'
          },
          {
            name: '`upperBound`',
            description: 'The upper bound.'
          }
        ]
      },
      {
        name: 'lessThanOrEquals',
        description: 'Checks if the value is less than or equal to the specified value.',
        example: "validator.ruleFor('age', lessThanOrEquals(65))",
        exampleErrorMessage: '*Value must be less than or equal to 65.*',
        parameters: [
          {
            name: '`comparisonValue`',
            description: 'The value to compare against.'
          }
        ]
      },
      {
        name: 'lessThan',
        description: 'Checks if the value is less than the specified value.',
        example: "validator.ruleFor('age', lessThan(65))",
        exampleErrorMessage: '*Value must be less than 65.*',
        parameters: [
          {
            name: '`comparisonValue`',
            description: 'The value to compare against.'
          }
        ]
      }
    ]
  },
  {
    title: 'Boolean',
    description: 'Rules that validate boolean properties.',
    validations: [
      {
        name: 'isFalse',
        description: 'Checks if the value is false.',
        example: "validator.ruleFor('isAdult', isFalse())",
        exampleErrorMessage: '*Value must be false.*'
      },
      {
        name: 'isTrue',
        description: 'Checks if the value is true.',
        example: "validator.ruleFor('isAdult', isTrue())",
        exampleErrorMessage: '*Value must be true.*'
      }
    ]
  },
  {
    title: 'String',
    description: 'Rules that validate string values.',
    validations: [
      {
        name: 'matches',
        description: 'Checks if the value matches the specified pattern.',
        example: "validator.ruleFor('name', matches(/^[A-Z][a-z]+$/))",
        exampleErrorMessage: '*Value must match pattern.*',
        parameters: [
          {
            name: '`pattern`',
            description: 'The pattern to match against.'
          }
        ]
      }
    ]
  }
];

const BuiltinValidations: NgDocPage = {
  title: `Built-in Validations`,
  mdFile: './index.md',
  route: `built-in-validations`,
  category: BuildingValidations,
  order: 1,
  keyword: 'BuildingValidationsBuiltinValidations',
  data: {
    validationCategories: validationCategories
  }
};

export default BuiltinValidations;
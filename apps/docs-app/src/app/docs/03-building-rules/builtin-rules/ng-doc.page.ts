import { NgDocPage } from '@ng-doc/core';
import BuildingRules from '../ng-doc.category';

interface RuleCategory {
  title: string;
  description: string;
  rules: Rule[];
}

interface Rule {
  name: string;
  description: string;
  example: string;
  exampleErrorMessage: string;
  parameters?: {
    name: string;
    description: string;
  }[];
}

const ruleCategories: RuleCategory[] = [
  {
    title: 'Common',
    description: 'Common rules that can be used with any type of value.',
    rules: [
      {
        name: 'EqualsRule',
        description: 'Checks if a value is equal to a specified comparison value.',
        example: "validator.ruleFor(person => person.name).equals('John')",
        exampleErrorMessage: '*name must be equal to John*',
        parameters: [
          {
            name: '`comparisonValue`',
            description: 'The value to compare with.'
          }
        ]
      },
      {
        name: 'IsNotNullRule',
        description: 'Checks if a value is not null.',
        example: 'validator.ruleFor(person => person.name).isNotNull()',
        exampleErrorMessage: '*name must not be null*'
      },
      {
        name: 'IsNullRule',
        description: 'Checks if a value is null.',
        example: 'validator.ruleFor(person => person.name).isNull()',
        exampleErrorMessage: '*name must be null*'
      },
      {
        name: 'MustRule',
        description: 'Checks if the value against a given predicate.',
        example: 'validator.ruleFor(person => person.name).must(name => name.startsWith("J"))',
        exampleErrorMessage: '*Condition for name was not met*',
        parameters: [
          {
            name: '`predicate`',
            description: 'The predicate to check against.'
          }
        ]
      },
      {
        name: 'NotEqualsRule',
        description: 'Checks if a value is not equal to a specified comparison value.',
        example: "validator.ruleFor(person => person.name).notEquals('John')",
        exampleErrorMessage: '*name must not be equal to John*',
        parameters: [
          {
            name: '`comparisonValue`',
            description: 'The value to compare with.'
          }
        ]
      }
    ]
  },
  {
    title: 'Length',
    description: 'Rules that validate the length of a value. The value must satisfy the constraint `{ length: number; }`',
    rules: [
      {
        name: 'EmptyRule',
        description: 'Checks if a value is empty.',
        example: 'validator.ruleFor(person => person.name).empty()',
        exampleErrorMessage: '*name must be empty*'
      },
      {
        name: 'MaxLengthRule',
        description: 'Checks if a value has a maximum length.',
        example: 'validator.ruleFor(person => person.name).maxLength(5)',
        exampleErrorMessage: '*name must have a maximum length of 5*',
        parameters: [
          {
            name: '`maxLength`',
            description: 'The maximum length of the value.'
          }
        ]
      },
      {
        name: 'MinLengthRule',
        description: 'Checks if a value has a minimum length.',
        example: 'validator.ruleFor(person => person.name).minLength(5)',
        exampleErrorMessage: '*name must have a minimum length of 5*',
        parameters: [
          {
            name: '`minLength`',
            description: 'The minimum length of the value.'
          }
        ]
      },
      {
        name: 'NotEmptyRule',
        description: 'Checks if a value is not empty.',
        example: 'validator.ruleFor(person => person.name).notEmpty()',
        exampleErrorMessage: '*name must not be empty*'
      }
    ]
  },
  {
    title: 'Number',
    description: 'Rules that validate numeric values.',
    rules: [
      {
        name: 'ExclusiveBetweenRule',
        description: 'Checks if a value is between two specified bounds (exclusive).',
        example: 'validator.ruleFor(person => person.age).exclusiveBetween(18, 65)',
        exampleErrorMessage: '*age must be between 18 and 65 (exclusive)*',
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
        name: 'GreaterThanOrEqualRule',
        description: 'Checks if a value is greater than or equal to a specified comparison value.',
        example: 'validator.ruleFor(person => person.age).greaterThanOrEqualTo(18)',
        exampleErrorMessage: '*age must be greater than or equal to 18*',
        parameters: [
          {
            name: 'referenceValue`',
            description: 'The value to compare with.'
          }
        ]
      },
      {
        name: 'GreaterThanRule',
        description: 'Checks if a value is greater than a specified comparison value.',
        example: 'validator.ruleFor(person => person.age).greaterThan(18)',
        exampleErrorMessage: '*age must be greater than 18*',
        parameters: [
          {
            name: '`referenceValue`',
            description: 'The value to compare with.'
          }
        ]
      },
      {
        name: 'InclusiveBetweenRule',
        description: 'Checks if a value is between two specified bounds (inclusive).',
        example: 'validator.ruleFor(person => person.age).inclusiveBetween(18, 65)',
        exampleErrorMessage: '*age must be between 18 and 65*',
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
        name: 'IsNegativeRule',
        description: 'Checks if a value is negative.',
        example: 'validator.ruleFor(person => person.age).isNegative()',
        exampleErrorMessage: '*age must be a negative number*'
      },
      {
        name: 'IsPositiveRule',
        description: 'Checks if a value is positive.',
        example: 'validator.ruleFor(person => person.age).isPositive()',
        exampleErrorMessage: '*age must be a positive number*'
      },
      {
        name: 'LessThanOrEqualRule',
        description: 'Checks if a value is less than or equal to a specified comparison value.',
        example: 'validator.ruleFor(person => person.age).lessThanOrEqualTo(65)',
        exampleErrorMessage: '*age must be less than or equal to 65*',
        parameters: [
          {
            name: '`referenceValue`',
            description: 'The value to compare with.'
          }
        ]
      },
      {
        name: 'LessThanRule',
        description: 'Checks if a value is less than a specified comparison value.',
        example: 'validator.ruleFor(person => person.age).lessThan(65)',
        exampleErrorMessage: '*age must be less than 65*',
        parameters: [
          {
            name: '`referenceValue`',
            description: 'The value to compare with.'
          }
        ]
      }
    ]
  },
  {
    title: 'String',
    description: 'Rules that validate string values.',
    rules: [
      {
        name: 'MatchesRule',
        description: 'Checks if a value matches a specified pattern.',
        example: 'validator.ruleFor(person => person.name).matches(/^[A-Z]/)',
        exampleErrorMessage: '*name must match the pattern /^[A-Z]/*',
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

const BuiltinRules: NgDocPage = {
  title: `Built-in Rules`,
  mdFile: './index.md',
  route: `building-rules/built-in-rules`,
  category: BuildingRules,
  order: 1,
  keyword: 'BuildingRulesBuiltInRules',
  data: {
    ruleCategories: ruleCategories
  }
};

export default BuiltinRules;

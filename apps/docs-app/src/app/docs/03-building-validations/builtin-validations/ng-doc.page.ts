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
  placeholders: {
    name: string;
    description: string;
  }[];
}

const validationCategories: ValidationCategory[] = [
  {
    title: 'Common',
    description: 'Common validations that can be used with any type of value.',
    validations: [
      {
        name: 'equals',
        description: 'Checks if a value equals a specified comparison value.',
        example: "validator.ruleFor('lastName', equals<string, Person>('John'))",
        exampleErrorMessage: `*'name' must equal John.*`,
        parameters: [
          {
            name: '`comparisonValue`',
            description: 'The value to compare against.'
          }
        ],
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          },
          {
            name: '`{comparisonValue}`',
            description: 'The value to compare against.'
          }
        ]
      },
      {
        name: 'isFalsy',
        description: 'Checks if a value is falsy.',
        example: "validator.ruleFor('lastName', isFalsy())",
        exampleErrorMessage: `*'name' must be falsy.*`,
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          }
        ]
      },
      {
        name: 'isNull',
        description: 'Checks if a value is null.',
        example: "validator.ruleFor('lastName', isNull())",
        exampleErrorMessage: `*'name' must be null.*`,
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          }
        ]
      },
      {
        name: 'isTruthy',
        description: 'Checks if a value is truthy.',
        example: "validator.ruleFor('lastName', isTruthy())",
        exampleErrorMessage: `*'name' must be truthy.*`,
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          }
        ]
      },
      {
        name: 'must',
        description: 'Checks the value against a given predicate.',
        example: "validator.ruleFor('lastName', must(name => name.startsWith('J')))",
        exampleErrorMessage: `*'name' must meet the specified criteria.*`,
        parameters: [
          {
            name: '`predicate`',
            description: 'The predicate to check against.'
          }
        ],
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          }
        ]
      },
      {
        name: 'notEquals',
        description: 'Checks if a value is not equal to a specified comparison value.',
        example: "validator.ruleFor('lastName', notEquals<string, Person>('John'))",
        exampleErrorMessage: `*'name' must not equal John.*`,
        parameters: [
          {
            name: '`comparisonValue`',
            description: 'The value to compare against.'
          }
        ],
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          },
          {
            name: '`{comparisonValue}`',
            description: 'The value to compare against.'
          }
        ]
      },
      {
        name: 'notNull',
        description: 'Checks if a value is not null.',
        example: "validator.ruleFor('lastName', notNull())",
        exampleErrorMessage: `*'name' must not be null.*`,
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          }
        ]
      },
      {
        name: 'required',
        description: 'Checks if a value is neither nullish nor empty.',
        example: "validator.ruleFor('lastName', required())",
        exampleErrorMessage: `*'name' is required.*`,
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          }
        ]
      }
    ]
  },
  {
    title: 'Length',
    description: 'Validations that validate the length of a value. The value must satisfy the constraint `{ length: number; }`',
    validations: [
      {
        name: 'empty',
        description: 'Checks if a values length is 0.',
        example: "validator.ruleFor('lastName', empty())",
        exampleErrorMessage: `*'name' must be empty.*`,
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          }
        ]
      },
      {
        name: 'length',
        description: 'Checks if a values length is between (inclusive) the specified minimum and maximum.',
        example: "validator.ruleFor('lastName', length(3, 5))",
        exampleErrorMessage: `*'name' must have a length between (inclusive) 3 and 5..*`,
        parameters: [
          {
            name: '`minLength`',
            description: 'The minimum length.'
          },
          {
            name: '`maxLength`',
            description: 'The maximum length.'
          }
        ],
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          },
          {
            name: '`{minLength}`',
            description: 'The minimum length.'
          },
          {
            name: '`{maxLength}`',
            description: 'The maximum length.'
          }
        ]
      },
      {
        name: 'maxLength',
        description: 'Checksif the values length is less than or equal to the specified maximum.',
        example: "validator.ruleFor('lastName', maxLength(5))",
        exampleErrorMessage: `*'name' must have a maximum length of 5.*`,
        parameters: [
          {
            name: '`maxLength`',
            description: 'The maximum length.'
          }
        ],
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          },
          {
            name: '`{maxLength}`',
            description: 'The maximum length.'
          }
        ]
      },
      {
        name: 'minLength',
        description: 'Checks  if the values length is greater than or equal to the specified minimum.',
        example: "validator.ruleFor('lastName', minLength(5))",
        exampleErrorMessage: `*'name' must have a minimum length of 5.*`,
        parameters: [
          {
            name: '`minLength`',
            description: 'The minimum length.'
          }
        ],
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          },
          {
            name: '`{minLength}`',
            description: 'The minimum length.'
          }
        ]
      },
      {
        name: 'notEmpty',
        description: 'Checks if a value is not empty.',
        example: "validator.ruleFor('lastName', notEmpty())",
        exampleErrorMessage: `*'name' must not be empty.*`,
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          }
        ]
      }
    ]
  },
  {
    title: 'Number',
    description: 'Validations that validate numeric values.',
    validations: [
      {
        name: 'exclusiveBetween',
        description: 'Checks if the value is between the specified bounds exclusively.',
        example: "validator.ruleFor('age', exclusiveBetween(18, 65))",
        exampleErrorMessage: `*'age' must be between 18 and 65 exclusively.*`,
        parameters: [
          {
            name: '`lowerBound`',
            description: 'The lower bound.'
          },
          {
            name: '`upperBound`',
            description: 'The upper bound.'
          }
        ],
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          },
          {
            name: '`{lowerBound}`',
            description: 'The lower bound.'
          },
          {
            name: '`{upperBound}`',
            description: 'The upper bound.'
          }
        ]
      },
      {
        name: 'greaterThanOrEquals',
        description: 'Checks if the value is greater than or equal to the specified value.',
        example: "validator.ruleFor('age', greaterThanOrEquals(18))",
        exampleErrorMessage: `*'age' must be greater than or equal to 18.*`,
        parameters: [
          {
            name: 'comparisonValue`',
            description: 'The value to compare against.'
          }
        ],
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          },
          {
            name: '`{comparisonValue}`',
            description: 'The value to compare against.'
          }
        ]
      },
      {
        name: 'greaterThan',
        description: 'Checks if the value is greater than the specified value.',
        example: "validator.ruleFor('age', greaterThan(18))",
        exampleErrorMessage: `*'age' must be greater than 18.*`,
        parameters: [
          {
            name: '`comparisonValue`',
            description: 'The value to compare against.'
          }
        ],
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          },
          {
            name: '`{comparisonValue}`',
            description: 'The value to compare against.'
          }
        ]
      },
      {
        name: 'inclusiveBetween',
        description: 'Checks  if the value is inclusively between the specified bounds',
        example: "validator.ruleFor('age', inclusiveBetween(18, 65))",
        exampleErrorMessage: `*'age' must be between 18 and 65 inclusively.*`,
        parameters: [
          {
            name: '`lowerBound`',
            description: 'The lower bound.'
          },
          {
            name: '`upperBound`',
            description: 'The upper bound.'
          }
        ],
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          },
          {
            name: '`{lowerBound}`',
            description: 'The lower bound.'
          },
          {
            name: '`{upperBound}`',
            description: 'The upper bound.'
          }
        ]
      },
      {
        name: 'lessThanOrEquals',
        description: 'Checks if the value is less than or equal to the specified value.',
        example: "validator.ruleFor('age', lessThanOrEquals(65))",
        exampleErrorMessage: `*'age' must be less than or equal to 65.*`,
        parameters: [
          {
            name: '`comparisonValue`',
            description: 'The value to compare against.'
          }
        ],
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          },
          {
            name: '`{comparisonValue}`',
            description: 'The value to compare against.'
          }
        ]
      },
      {
        name: 'lessThan',
        description: 'Checks if the value is less than the specified value.',
        example: "validator.ruleFor('age', lessThan(65))",
        exampleErrorMessage: `*'age' must be less than 65.*`,
        parameters: [
          {
            name: '`comparisonValue`',
            description: 'The value to compare against.'
          }
        ],
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          },
          {
            name: '`{comparisonValue}`',
            description: 'The value to compare against.'
          }
        ]
      }
    ]
  },
  {
    title: 'Boolean',
    description: 'Validations that validate boolean properties.',
    validations: [
      {
        name: 'isFalse',
        description: 'Checks if the value is false.',
        example: "validator.ruleFor('isAdult', isFalse())",
        exampleErrorMessage: `*'isAdult' must be false.*`,
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          }
        ]
      },
      {
        name: 'isTrue',
        description: 'Checks if the value is true.',
        example: "validator.ruleFor('isAdult', isTrue())",
        exampleErrorMessage: `*'isAdult' must be true.*`,
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
          }
        ]
      }
    ]
  },
  {
    title: 'String',
    description: 'Validations that validate string values.',
    validations: [
      {
        name: 'matches',
        description: 'Checks if the value matches the specified pattern.',
        example: "validator.ruleFor('lastName', matches(/^[A-Z][a-z]+$/))",
        exampleErrorMessage: `*'name' must match pattern.*`,
        parameters: [
          {
            name: '`pattern`',
            description: 'The pattern to match against.'
          }
        ],
        placeholders: [
          {
            name: '`{propertyName}`',
            description: 'Name of the property being validated.'
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
  data: {
    validationCategories: validationCategories
  }
};

export default BuiltinValidations;

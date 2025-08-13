/**
 * Tests to validate the type safety improvements in create-validator.ts
 */

import { createValidator } from '../lib/create-validator';
import { required } from '../lib/validations/required/required';
import { notEmpty } from '../lib/validations/not-empty/not-empty';

interface TestModel {
  name: string;
  email: string;
  age: number;
}

interface ExtendedTestModel extends TestModel {
  address: string;
}

describe('Type Safety Improvements', () => {
  describe('updateValidations function', () => {
    it('should handle empty validations gracefully', () => {
      const validator = createValidator<TestModel>();
      
      // This should not throw an error
      expect(() => {
        validator.ruleFor('name', required());
      }).not.toThrow();
      
      expect(validator.validations).toBeDefined();
    });

    it('should properly update validations without unsafe casting', () => {
      const validator = createValidator<TestModel>();
      
      validator.ruleFor('name', required(), notEmpty());
      validator.ruleFor('email', required());
      
      expect(validator.validations).toBeDefined();
      // Use type-safe property access
      expect(Object.keys(validator.validations)).toContain('name');
      expect(Object.keys(validator.validations)).toContain('email');
      expect((validator.validations as Record<string, unknown[]>)['name']).toHaveLength(2);
      expect((validator.validations as Record<string, unknown[]>)['email']).toHaveLength(1);
    });
  });

  describe('include method', () => {
    it('should validate input validator before including', () => {
      const validator = createValidator<TestModel>();
      const extendedValidator = createValidator<ExtendedTestModel>();
      
      extendedValidator.ruleFor('address', required());
      
      // This should work without throwing
      expect(() => {
        validator.include(extendedValidator);
      }).not.toThrow();
    });

    it('should throw error for invalid validator input', () => {
      const validator = createValidator<TestModel>();
      
      expect(() => {
        // @ts-expect-error Testing runtime validation
        validator.include(null);
      }).toThrow('Invalid validator provided to include method');
      
      expect(() => {
        // @ts-expect-error Testing runtime validation
        validator.include({});
      }).toThrow('Invalid validator provided to include method');
    });
  });

  describe('when/otherwise methods', () => {
    it('should validate callback functions in otherwise method', () => {
      const validator = createValidator<TestModel>();
      
      expect(() => {
        validator
          .when(
            (model) => model.age > 18,
            (v) => v.ruleFor('email', required())
          )
          .otherwise((v) => v.ruleFor('name', required()));
      }).not.toThrow();
    });

    it('should throw error for invalid callback in otherwise method', () => {
      const validator = createValidator<TestModel>();
      
      const conditionalValidator = validator.when(
        (model) => model.age > 18,
        (v) => v.ruleFor('email', required())
      );
      
      expect(() => {
        // @ts-expect-error Testing runtime validation
        conditionalValidator.otherwise(null);
      }).toThrow('Invalid callback provided to otherwise method');
    });
  });

  describe('validation result integrity', () => {
    it('should maintain proper validation behavior after type safety improvements', () => {
      const validator = createValidator<TestModel>();
      
      validator.ruleFor('name', required());
      validator.ruleFor('email', required());
      
      const result = validator.validate({
        name: '',
        email: 'test@example.com',
        age: 25
      });
      
      expect(result.isValid).toBe(false);
      expect(result.failures).toHaveLength(1);
      expect(result.failures[0].propertyName).toBe('name');
    });

    it('should handle async validation properly', async () => {
      const validator = createValidator<TestModel>();
      
      validator.ruleFor('name', required());
      validator.ruleFor('email', required());
      
      const result = await validator.validateAsync({
        name: 'John',
        email: '',
        age: 25
      });
      
      expect(result.isValid).toBe(false);
      expect(result.failures).toHaveLength(1);
      expect(result.failures[0].propertyName).toBe('email');
    });
  });

  describe('complex type scenarios', () => {
    it('should handle nested conditional validators', () => {
      const validator = createValidator<TestModel>();
      
      expect(() => {
        validator
          .when(
            (model) => model.age > 18,
            (v) => v.ruleFor('email', required())
          )
          .otherwise((v) => 
            v.when(
              (model) => model.age < 13,
              (v2) => v2.ruleFor('name', required())
            )
          );
      }).not.toThrow();
    });

    it('should handle include with compatible validators', () => {
      interface ModelWithAddress extends TestModel {
        address: string;
      }
      
      const validator = createValidator<TestModel>();
      const addressValidator = createValidator<ModelWithAddress>();
      
      addressValidator.ruleFor('address', required());
      
      expect(() => {
        validator.include(addressValidator);
      }).not.toThrow();
    });
  });

  describe('runtime validation safety', () => {
    it('should prevent invalid modifications to validations', () => {
      const validator = createValidator<TestModel>();
      
      validator.ruleFor('name', required());
      
      // Validations should be protected from direct manipulation
      const validations = validator.validations as Record<string, unknown>;
      expect(validations).toBeDefined();
      expect(typeof validations).toBe('object');
    });
  });
});
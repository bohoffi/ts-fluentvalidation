# @ts-fluentvalidation/core Improvement Plan

## Priority 1: Critical Issues (High Impact, Low Risk)

### 1.1 Fix Directory Naming Typo

**Issue**: Directory named `set-valildator` instead of `set-validator`
**Impact**: Confusing for developers, potential import issues
**Breaking Changes**: None (internal structure)
**Effort**: Low

**Changes Required**:

- Rename `/libs/core/src/lib/validations/set-valildator/` to `/libs/core/src/lib/validations/set-validator/`
- Update import path in `/libs/core/src/lib/validations/index.ts`

### 1.2 Eliminate `any` Type Usage

**Issue**: Use of `any` type in type guards reduces type safety
**Impact**: Runtime errors, poor IDE support
**Breaking Changes**: None (internal implementation)
**Effort**: Low

**Changes Required**:

- Replace `any` with proper generic types in `validation-context.ts:42`
- Add proper type constraints for validation context type guards
- Implement stricter type checking for validation metadata

### 1.3 Fix Type Casting Issues

**Issue**: Unsafe `unknown` casting in validator creation
**Impact**: Potential runtime errors, poor type inference
**Breaking Changes**: Possible minor API changes
**Effort**: Medium

**Changes Required**:

- Review and fix type casting in `create-validator.ts` lines 34, 148
- Implement proper type guards for validator validations
- Add runtime type checking where necessary

## Priority 2: Performance Optimizations (High Impact, Medium Risk)

### 2.1 Implement Validation Caching

**Issue**: No caching mechanism for compiled validators
**Impact**: Performance degradation with repeated validations
**Breaking Changes**: None (additive feature)
**Effort**: Medium

**Changes Required**:

- Add optional caching layer in `createValidator`
- Implement cache invalidation strategies
- Add configuration options for cache behavior
- Create benchmarks to measure performance improvements

### 2.2 Optimize Validation Metadata Copying

**Issue**: Excessive object spreading and recreation in `createWithMetadata`
**Impact**: Memory usage and performance
**Breaking Changes**: None (internal optimization)
**Effort**: Medium

**Changes Required**:

- Implement copy-on-write semantics for validation metadata
- Use Object.freeze for immutable metadata
- Optimize validation chain building
- Add memory profiling tests

### 2.3 Add Early Termination Optimizations

**Issue**: No early termination in validation loops
**Impact**: Unnecessary validation execution
**Breaking Changes**: None (behavior optimization)
**Effort**: Low

**Changes Required**:

- Implement early termination in `validateSync` and `validateAsync`
- Add configuration for fail-fast validation modes
- Optimize array validation loops

## Priority 3: API Improvements (Medium Impact, Medium Risk)

### 3.1 Enhance Error Context and Debugging

**Issue**: Limited error context and debugging capabilities
**Impact**: Poor developer experience during debugging
**Breaking Changes**: Minor (additional properties on error objects)
**Effort**: Medium

**Changes Required**:

- Add validation chain context to error messages
- Include failed values in validation results (with privacy controls)
- Add stack trace information for validation failures
- Implement validation debugging utilities

**New API**:

```typescript
interface ValidationFailure {
  // ...existing properties...
  validationChain?: string[];
  failedValue?: unknown; // Optional, configurable
  stackTrace?: string;
}

interface ValidatorConfig<TModel> {
  // ...existing properties...
  includeFailedValues?: boolean;
  includeStackTraces?: boolean;
  debugMode?: boolean;
}
```

### 3.2 Simplify Conditional Validation API

**Issue**: Complex conditional validation API
**Impact**: Developer experience and code readability
**Breaking Changes**: None (additive improvements)
**Effort**: Medium

**Changes Required**:

- Add fluent conditional validation builders
- Implement validation rule grouping
- Add conditional validation templates

**New API**:

```typescript
validator
  .ruleFor('email', required())
  .when(model => model.contactMethod === 'email')
  .otherwiseRuleFor('phone', required())
  .when(model => model.contactMethod === 'phone');
```

### 3.3 Add Bulk Configuration Methods

**Issue**: No bulk validation configuration
**Impact**: Verbose configuration for complex validators
**Breaking Changes**: None (additive feature)
**Effort**: Low

**Changes Required**:

- Add `configureAll()` method for bulk validation configuration
- Implement validation rule templates
- Add validation inheritance mechanisms

## Priority 4: Architecture Improvements (Medium Impact, High Risk)

### 4.1 Implement Plugin System

**Issue**: No extensibility mechanism for custom validation types
**Impact**: Limited extensibility
**Breaking Changes**: None (additive feature)
**Effort**: High

**Changes Required**:

- Design plugin architecture for validation extensions
- Create plugin registration system
- Add plugin lifecycle management
- Implement plugin dependency resolution

**New API**:

```typescript
interface ValidationPlugin {
  name: string;
  version: string;
  validations: Record<string, ValidationFactory>;
  install(context: PluginContext): void;
}

registerPlugin(plugin: ValidationPlugin): void;
```

### 4.2 Add Validation Result Transformation

**Issue**: No built-in result transformation utilities
**Impact**: Limited result processing capabilities
**Breaking Changes**: None (additive feature)
**Effort**: Medium

**Changes Required**:

- Add result transformation pipeline
- Implement common transformation patterns
- Add result aggregation utilities
- Create result serialization helpers

### 4.3 Implement Lazy Loading for Validations

**Issue**: All validations loaded regardless of usage
**Impact**: Bundle size optimization opportunity
**Breaking Changes**: Possible import path changes
**Effort**: High

**Changes Required**:

- Restructure validation exports for tree-shaking
- Implement dynamic validation loading
- Add validation registration system
- Update build configuration for optimal bundling

## Priority 5: Developer Experience (Low Impact, Low Risk)

### 5.1 Enhance Documentation and Types

**Issue**: Limited JSDoc and type documentation
**Impact**: Developer onboarding and IDE support
**Breaking Changes**: None
**Effort**: Medium

**Changes Required**:

- Add comprehensive JSDoc comments
- Include usage examples in type definitions
- Add validation guides and best practices
- Implement inline documentation helpers

### 5.2 Expand Internationalization

**Issue**: Limited language support and features
**Impact**: Global adoption
**Breaking Changes**: None (additive feature)
**Effort**: Medium

**Changes Required**:

- Add more language translations
- Implement pluralization support
- Add locale-specific formatting
- Support RTL languages

### 5.3 Add Memory Management Utilities

**Issue**: Potential memory leaks with complex validators
**Impact**: Long-running application performance
**Breaking Changes**: None (additive feature)
**Effort**: Low

**Changes Required**:

- Add validator disposal methods
- Implement validation context cleanup
- Add memory usage monitoring
- Create memory leak detection utilities

## Implementation Roadmap

### Phase 1 (1-2 weeks): Critical Fixes

- [ ] Fix directory naming typo
- [ ] Eliminate `any` type usage
- [ ] Basic type casting improvements

### Phase 2 (3-4 weeks): Performance & API

- [ ] Implement validation caching
- [ ] Optimize metadata copying
- [ ] Enhance error context
- [ ] Add bulk configuration methods

### Phase 3 (4-6 weeks): Architecture

- [ ] Design plugin system
- [ ] Implement result transformation
- [ ] Add lazy loading infrastructure

### Phase 4 (2-3 weeks): Developer Experience

- [ ] Enhance documentation
- [ ] Expand internationalization
- [ ] Add memory management utilities

## Risk Assessment

**Low Risk**: Type fixes, performance optimizations, documentation
**Medium Risk**: API additions, conditional validation improvements
**High Risk**: Plugin system, lazy loading, major architectural changes

## Success Metrics

- Bundle size reduction: 15-20%
- Validation performance improvement: 25-30%
- Developer satisfaction (survey): >4.5/5
- Memory usage reduction: 20-25%
- API adoption rate for new features: >60%

## Contributing

This roadmap is a living document. If you're interested in contributing to any of these improvements:

1. Check the existing issues and pull requests
2. Create an issue to discuss the improvement before starting work
3. Follow the contribution guidelines in `CONTRIBUTING.md`
4. Reference this roadmap in your issue/PR description

## Feedback

We welcome feedback on this roadmap. Please create an issue with the `roadmap` label to discuss any of these improvements or suggest additional ones.

---

_Last updated: August 2, 2025_
_Status: Draft - Open for community feedback_

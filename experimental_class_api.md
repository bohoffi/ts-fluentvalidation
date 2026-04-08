# Experimental: Class-Based API Refactoring Plan

## Background & Motivation

The current implementation of `@ts-fluentvalidation/core` is built on a **functional pattern**:

- **Validators** are plain objects created by the `createValidator<TModel>()` factory function, with state managed via closures.
- **Validations** are the most unusual part: they are **callable functions extended with metadata and fluent methods** — essentially a `(value: TValue) => boolean` function with `.metadata`, `.when()`, `.withMessage()`, etc. attached via `Object.assign`.

The goal of this refactoring is to transition away from these two functional patterns toward a **class-based implementation** that is more familiar to OOP-oriented developers, easier to subclass, and cleaner in structure — while preserving the public API and existing behavior as much as possible.

The refactoring is planned in **at least two independent steps**, so that each step can be reviewed, tested, and merged independently.

---

## Current Architecture Deep-Dive

### 1. The Validator (object factory)

`createValidator<TModel>(config?)` returns a **plain object literal** — not a class instance — that satisfies the `Validator<TModel, ModelValidations>` interface. All state is held in **closures**:

```ts
// Private state captured in closure
const keyValidations: KeyValidations<TModel>[] = [];
const validatorConfig: ValidatorConfig<TModel> = { ... };
let preValidation = () => true;

return {
  validations: _validations,
  ruleFor(...) { ... return this; },
  ruleForEach(...) { ... return this; },
  validate(model) { ... },
  // ...
};
```

The second generic `ModelValidations` grows on each `ruleFor` call, tracking which keys have been validated **at the TypeScript type level**:

```ts
// After .ruleFor('age', ...).ruleFor('name', ...)
// type becomes: Validator<Person, Record<'age', ...> & Record<'name', ...>>
```

### 2. The Validation (callable function + metadata hybrid)

This is the core unusual pattern. `createValidation(fn)` in `create-validation.ts`:

1. Creates a wrapper function `validation = (value) => fn(value)`
2. Attaches a `metadata` object to it
3. Creates a separate `validationBase` object with all fluent methods
4. Returns `Object.assign(validation, validationBase)`

The result is an object that is **both callable as a function and has methods/properties**:

```ts
const v = notEmpty(); // SyncValidation<string, unknown>
v('hello');           // callable — returns true
v.metadata;           // has metadata
v.withMessage('!');   // has fluent methods
v.when(m => m.active); // etc.
```

The TypeScript type reflects this: `ValidationBase<TValue, TValidationFunction, TModel> = { metadata, methods... } & TValidationFunction`.

### 3. The ValidatorValidation (setValidator pattern)

`setValidator` and `setValidatorAsync` create a special kind of validation by:
1. Creating a normal validation via `createValidation()`
2. **Imperatively patching** a `.validator` property onto it after creation:

```ts
const validatorValidation = createValidation(...) as SyncValidatorValidation<...>;
validatorValidation.validator = validator; // ad-hoc mutation
```

The `isValidatorValidation` type guard detects this pattern by checking:
```ts
typeof validation === 'function' && 'validator' in validation
```

### 4. The execution engine

`validate-key-sync.ts` and `validate-key-async.ts` **call validations as functions**:

```ts
// validate-key-sync.ts
if (!validation(propertyValue)) { ... }

// validate-key-async.ts
if (!(await validation(propertyValue))) { ... }
```

These are the only 4 places in the entire codebase where a validation is invoked as a callable.

---

## Step 1: Refactor Validations to Classes

### Goal

Replace the callable function+metadata hybrid pattern with a proper `ValidationRule<TValue, TModel>` class, while keeping the public-facing API of built-in validators (`notEmpty()`, `must()`, etc.) identical from a consumer's perspective.

### Proposed `ValidationRule` class

```ts
class ValidationRule<TValue, TModel, TAsync extends boolean = false> {
  readonly metadata: ValidationMetadata<TAsync, TModel>;

  constructor(
    private readonly fn: TAsync extends true
      ? (value: TValue) => Promise<boolean>
      : (value: TValue) => boolean,
    metadata: Partial<ValidationMetadata<TAsync, TModel>>
  ) {
    this.metadata = {
      isAsync: false as TAsync,
      placeholders: {},
      ...metadata
    };
  }

  invoke(value: TValue): TAsync extends true ? Promise<boolean> : boolean {
    return (this.fn as (v: TValue) => unknown)(value) as never;
  }

  invokeCondition(model: TModel, ctx: ValidationContext<TModel>): boolean {
    return this.metadata.condition ? this.metadata.condition(model, ctx) : true;
  }

  async invokeAsyncCondition(model: TModel, ctx: ValidationContext<TModel>): Promise<boolean> {
    return this.metadata.asyncCondition ? this.metadata.asyncCondition(model, ctx) : true;
  }

  // --- fluent methods (all return new instances) ---

  withMessage(message: string): ValidationRule<TValue, TModel, TAsync> { ... }
  withErrorCode(errorCode: string): ValidationRule<TValue, TModel, TAsync> { ... }
  withName(propertyName: string): ValidationRule<TValue, TModel, TAsync> { ... }
  overridePropertyName(propertyNameOverride: string): ValidationRule<TValue, TModel, TAsync> { ... }
  withPlaceholder(key: string, value: unknown): ValidationRule<TValue, TModel, TAsync> { ... }
  withSeverity(severityOrProvider: Severity | ((model, value) => Severity)): ValidationRule<...> { ... }
  withState(stateOrProvider: unknown | ((model, value) => unknown)): ValidationRule<...> { ... }
  when(predicate: ValidationPredicate<TModel>, applyTo?: ApplyConditionTo): ValidationRule<...> { ... }
  whenAsync(predicate: AsyncValidationPredicate<TModel>, applyTo?: ApplyConditionTo): ValidationRule<...> { ... }
  unless(predicate: ValidationPredicate<TModel>, applyTo?: ApplyConditionTo): ValidationRule<...> { ... }
  unlessAsync(predicate: AsyncValidationPredicate<TModel>, applyTo?: ApplyConditionTo): ValidationRule<...> { ... }
}
```

### ValidatorValidationRule subclass

The `setValidator`/`setValidatorAsync` pattern needs special handling. Instead of ad-hoc property mutation, a dedicated subclass carries the nested validator:

```ts
class ValidatorValidationRule<TValue, TModel, TAsync extends boolean = false>
  extends ValidationRule<TValue, TModel, TAsync> {
  constructor(
    fn: ...,
    metadata: ...,
    public readonly validator: ValidatorCore<TValue & object>
  ) {
    super(fn, metadata);
  }
}
```

The `isValidatorValidation` guard is updated to use `instanceof ValidatorValidationRule` (or a simpler duck-type check on a `validator` property without requiring `typeof === 'function'`).

### Complete inventory of call sites that invoke a validation as a function

These are **all** the places in the codebase where `validation(value)` (direct invocation) occurs. Every single one must change to `validation.invoke(value)`:

| File | Occurrences | Detail |
|---|---|---|
| `functions/validate-key-sync.ts` | 2 | `if (!validation(propertyValue))` and `if (!validation(item as TItem))` |
| `functions/validate-key-async.ts` | 2 | `if (!(await validation(propertyValue)))` and `if (!(await validation(item as TItem)))` |
| `validations/not/not.ts` | 1 | `createValidation(value => !validation(value), ...)` — the `not()` combinator wraps another validation and calls it directly |
| `__tests__/assertions.ts` | 4 | `expectValidationToPass`: `validation(value)`, `expectValidationToPassAsync`: `await validation(value)`, `expectValidationToFail`: `validation(value)`, `expectValidationToFailAsync`: `await validation(value)` |

**Total: 9 call sites across 4 files.**

### Files that change

| File | Change |
|---|---|
| `validations/create-validation.ts` | Replace with `ValidationRule` class (keep `createValidation` / `createAsyncValidation` as thin factories for backward compat) |
| `types/validations.ts` | Redefine `ValidationBase`, `SyncValidation`, `AsyncValidation` as class-based types; remove `& TValidationFunction`; update `isValidatorValidation` guard |
| `validations/set-validator/set-validator.ts` | Use `ValidatorValidationRule` instead of ad-hoc property mutation |
| `validations/set-validator/set-validator-async.ts` | Same — uses `createAsyncValidation` and then mutates `.validator` |
| `functions/validate-key-sync.ts` | `validation(value)` → `validation.invoke(value)` (2 occurrences) |
| `functions/validate-key-async.ts` | `await validation(value)` → `await validation.invoke(value)` (2 occurrences) |
| `validations/not/not.ts` | `!validation(value)` → `!validation.invoke(value)` (1 occurrence) |
| `__tests__/assertions.ts` | `expectValidationToPass/Fail/Async` helpers call validation directly — change to `.invoke()` |

### Files that do NOT change

- `create-validator.ts` — already calls `.metadata`, `.invokeCondition()`, `.when()` etc. as methods; no direct invocations
- All built-in validators except `not.ts` (`notEmpty`, `must`, `matches`, etc.) — they only call `createValidation()` / delegate to other validators
- `validate-sync.ts` / `validate-async.ts` — only call `validateKeySync`/`validateKeyAsync`, no direct validation invocations
- `validation-context.ts`, `result/`, `errors/`, `i18n/`, `version.ts` — untouched
- All spec files — from a consumer perspective `notEmpty().withMessage('...')` is identical; the only test file that changes is `assertions.ts` (the shared helper module)

### Type-level trade-off

`ValidationBase` is currently exported and typed as `{ methods } & TValidationFunction`. Removing the `& TValidationFunction` part is a **technically breaking type change**: anyone who calls a validation directly as a function (e.g. `notEmpty()('value')`) would get a type error. In practice this is unlikely since:

1. The intended use is always `ruleFor('key', notEmpty())` — never calling the validation directly.
2. The `createValidation` / `createAsyncValidation` factories remain in the public API, just returning class instances.

The `ValidationBase` type itself can be redefined as an interface matching the class shape, keeping all method signatures identical.

---

## Step 2: Refactor Validators to Classes

### Goal

Replace the `createValidator<TModel>()` object factory with an `AbstractValidator<TModel>` base class that users extend.

### Proposed design

```ts
abstract class AbstractValidator<TModel extends object> implements ValidatorCore<TModel> {
  private readonly _keyValidations: KeyValidations<TModel>[] = [];
  private readonly _config: ValidatorConfig<TModel>;

  constructor(config?: ValidatorConfig<TModel>) {
    this._config = { cascadeMode: 'Continue', ...config };
  }

  protected ruleFor<Key extends KeyOf<TModel>>(
    key: Key,
    ...validations: Validation<TModel[Key], TModel>[]
  ): void { ... }

  protected ruleForEach<Key extends ArrayKeyOf<TModel>>(
    key: Key,
    ...validations: Validation<InferArrayElement<TModel[Key]>, TModel>[]
  ): void { ... }

  validate(model: TModel, config?: ...): ValidationResult { ... }
  validateAsync(model: TModel, config?: ...): Promise<ValidationResult> { ... }
  validateAndThrow(model: TModel): ValidationResult { ... }
  validateAndThrowAsync(model: TModel): Promise<ValidationResult> { ... }
}
```

Usage would be:

```ts
class PersonValidator extends AbstractValidator<Person> {
  constructor() {
    super();
    this.ruleFor('age', greaterThanOrEquals(18));
    this.ruleFor('name', notEmpty().withMessage('Name is required'));
  }
}

const validator = new PersonValidator();
validator.validate({ age: 17, name: '' });
```

### Key design considerations for Step 2

#### The `ModelValidations` generic type

The current `Validator<TModel, ModelValidations>` tracks validated keys at the type level (the second generic grows as rules are added). This works because the factory function returns a new type on each `ruleFor` call using `return this as Validator<TModel, ModelValidations & Record<Key, ...>>`.

In a class, `this` type doesn't narrow automatically on method calls within the constructor. **Options:**

1. **Drop `ModelValidations` tracking** — the class only exposes `validate()` / `validateAsync()`, and the type-level tracking is abandoned. Simpler, but loses the compile-time "did I add a rule for this key?" feature.

2. **Keep it via a builder** — The class delegates rule-adding to a separate builder/proxy returned from a `rules()` method, which can still track `ModelValidations`. More complex.

3. **Keep via `declare` / `as const` pattern** — TypeScript-only trick where the class declares the validations type separately. Possibly too magical.

The most pragmatic approach is option 1 for the class-based API: the `validate()` method works the same, but compile-time validation of which keys have rules is a feature users opt into only if they use the functional API.

#### `include()`, `when()`, `unless()` on the class

These would become `protected` methods in `AbstractValidator`, called in the constructor just like `ruleFor`. The `otherwise()` branching would return `void` (rules are registered as a side effect) rather than a new validator type.

#### `preValidate()`

Becomes a protected override hook:

```ts
protected preValidate(ctx: ValidationContext<TModel>, result: ValidationResult): boolean {
  return true; // default implementation
}
```

#### Backward compatibility

The `createValidator()` factory function can be kept as a thin wrapper around the internal class for a deprecation period:

```ts
// backward compat shim
export function createValidator<TModel extends object>(config?: ValidatorConfig<TModel>) {
  return new InternalValidatorClass<TModel>(config);
}
```

---

## Commands

### Run tests for `@ts-fluentvalidation/core`

```bash
npm exec nx run @ts-fluentvalidation/core:test
```

**Baseline:** 424 tests, 40 test suites — all passing before any changes.

### Build `@ts-fluentvalidation/core`

```bash
npm exec nx run @ts-fluentvalidation/core:build
```

**Baseline:** build passes before any changes. Both build and test should pass after each step of this refactoring.

---

## Risks & Considerations

### Immutability of ValidationRule

The current `createWithMetadata()` pattern in `create-validation.ts` creates a new validation instance for every fluent call (`.withMessage()` returns a new function, not mutating the original). This immutability **must** be preserved in the class — each fluent method must return a **new instance** with updated metadata, not mutate `this`. This is important because the same base validation (e.g. `notEmpty()`) might be reused across multiple validators.

A private `clone(overrides: Partial<ValidationMetadata>): ValidationRule` helper method on the class is the recommended approach:

```ts
private clone(overrides: Partial<ValidationMetadata<TAsync, TModel>>): ValidationRule<TValue, TModel, TAsync> {
  return new ValidationRule(this.fn, { ...this.metadata, ...overrides });
}

withMessage(message: string): ValidationRule<TValue, TModel, TAsync> {
  return this.clone({ message });
}
```

### The `not()` combinator

`not.ts` currently wraps a validation by calling it as a function:
```ts
createValidation(value => !validation(value), validation.metadata.message)
```
After the refactor, this becomes:
```ts
createValidation(value => !validation.invoke(value), validation.metadata.message)
```
Simple one-line change. The `not()` function signature and return type stay the same.

### `setValidatorAsync` also mutates `.validator`

`set-validator-async.ts` follows the same ad-hoc property mutation pattern as `set-validator.ts`:
```ts
const validatorValidation = createAsyncValidation(...) as unknown as AsyncValidatorValidation<...>;
validatorValidation.validator = validator; // <-- mutation
```
Both `setValidator` and `setValidatorAsync` must be updated to use `ValidatorValidationRule`.

### `ruleForEach` and `isEach` metadata flag

Currently `ruleForEach` in `create-validator.ts` marks each validation with `v.metadata.isEach = true` via direct mutation:
```ts
validations.forEach(v => { v.metadata.isEach = true; });
```
Since `metadata` will be a readonly object on the class, direct mutation won't work. Two options:
1. Add a package-internal `markAsEach(): ValidationRule` method that returns a clone with `isEach: true` (preferred — keeps immutability).
2. Accept `isEach` as a constructor option passed in from `ruleForEach`.

Either way, `create-validator.ts` changes from `v.metadata.isEach = true` to `v.markAsEach()` (or similar).

### `assertions.ts` — test helper file DOES change

The `__tests__/assertions.ts` file contains shared helpers used by all spec files. Four of them call validations directly as functions:

```ts
// current — breaks after Step 1
export function expectValidationToPass(validation, value) {
  expect(validation(value)).toBe(true);
}
```

After Step 1 these must become:
```ts
export function expectValidationToPass(validation, value) {
  expect(validation.invoke(value)).toBe(true);
}
```

The individual spec files themselves (`.spec.ts`) do not call validations directly and need no changes. Only `assertions.ts` changes.

### Testing surface

The existing test suite covers:
- `validator.spec.ts` — full validator lifecycle
- `conditions.spec.ts` — `when`/`unless`/`whenAsync`/`unlessAsync`
- `rule-for.spec.ts`, `rule-for-each.spec.ts`
- `create-validation.spec.ts`
- `errors.spec.ts`, `i18n.spec.ts`, `message-formatter.spec.ts`, `validation-result.spec.ts`, `validator-config.spec.ts`

After Step 1, the test suite should pass with only `assertions.ts` requiring modification. After Step 2, tests that use `createValidator()` would still pass (via the shim), and new tests exercising the class-based `AbstractValidator` API would be added.

### Breaking changes summary

| Step | Breaking change | Likelihood of impact |
|---|---|---|
| Step 1 | `ValidationBase` no longer callable as a function (`v(value)` breaks) | Very low — consumers use `ruleFor`, not direct invocation |
| Step 1 | `isValidatorValidation` guard no longer checks `typeof === 'function'` | Internal only, not exported |
| Step 2 | `Validator` interface / `createValidator` return type changes if `ModelValidations` tracking is dropped | Medium — depends on how consumers use the type |
| Step 2 | `when`/`unless` on `AbstractValidator` return `void` instead of typed validator | Low for most uses; affects type-level composition patterns |

---

## Implementation Order

```
Step 1: Refactor Validations
├── 1a. Create ValidationRule<TValue, TModel, TAsync> class in create-validation.ts
│       - private fn field
│       - readonly metadata field  
│       - invoke(value) method
│       - invokeCondition / invokeAsyncCondition methods
│       - private clone(overrides) helper for immutable fluent methods
│       - when / whenAsync / unless / unlessAsync / withMessage / withErrorCode /
│         withName / overridePropertyName / withPlaceholder / withSeverity / withState
│       - keep createValidation() and createAsyncValidation() as factory shims
├── 1b. Create ValidatorValidationRule subclass
│       - extends ValidationRule with a public readonly validator field
│       - used by setValidator and setValidatorAsync
├── 1c. Update types/validations.ts
│       - redefine ValidationBase as an interface (remove & TValidationFunction)
│       - update SyncValidation / AsyncValidation to class-based types
│       - update isValidatorValidation guard (no longer checks typeof === 'function')
├── 1d. Update functions/validate-key-sync.ts
│       - validation(propertyValue) → validation.invoke(propertyValue)  [line ~68]
│       - validation(item as TItem) → validation.invoke(item as TItem)   [line ~94]
├── 1e. Update functions/validate-key-async.ts
│       - await validation(propertyValue) → await validation.invoke(propertyValue) [line ~73]
│       - await validation(item as TItem) → await validation.invoke(item as TItem) [line ~99]
├── 1f. Update validations/not/not.ts
│       - !validation(value) → !validation.invoke(value)
├── 1g. Update validations/set-validator/set-validator.ts
│       - replace createValidation + property mutation with new ValidatorValidationRule(...)
├── 1h. Update validations/set-validator-async/set-validator-async.ts
│       - same as 1g for the async variant
├── 1i. Update create-validator.ts ruleForEach
│       - v.metadata.isEach = true → v = v.markAsEach() (or equivalent clone approach)
├── 1j. Update __tests__/assertions.ts
│       - expectValidationToPass/Fail/PassAsync/FailAsync: validation(value) → validation.invoke(value)
└── Verify: npm exec nx run @ts-fluentvalidation/core:test → 424 tests, 40 suites still passing

Step 2: Refactor Validators
├── 2a. Decide on ModelValidations tracking strategy (see options in Step 2 section)
├── 2b. Create AbstractValidator<TModel> class
│       - constructor(config?: ValidatorConfig<TModel>)
│       - private _keyValidations array
│       - protected ruleFor / ruleForEach / include / when / unless / preValidate
│       - public validate / validateAsync / validateAndThrow / validateAndThrowAsync
├── 2c. Keep createValidator() as a backward-compat shim (deprecation warning optional)
├── 2d. Add new tests for AbstractValidator usage pattern
└── Verify: npm exec nx run @ts-fluentvalidation/core:test → all tests still passing
```

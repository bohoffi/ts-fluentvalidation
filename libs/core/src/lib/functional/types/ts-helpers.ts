export type KeyOf<T extends object> = Extract<keyof T, string> & string;
export type EmptyObject = NonNullable<unknown>;

/**
 * Represents a type that prettifies another type by preserving all its properties.
 *
 * @typeParam T - The type to be prettified.
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & EmptyObject;

/**
 * Represents a type where given keys are required.
 */
export type RequiredByKeys<T, K extends keyof T> = Prettify<Omit<T, K> & { [P in K]-?: T[P] }>;

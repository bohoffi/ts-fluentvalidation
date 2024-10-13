/**
 * Represents a type that extracts the key values of an object type `T`.
 * The key values are represented as strings.
 * For example, if `T` has a key `order`, `KeyOf<T>` would allow strings like `order`.
 */
export type KeyOf<T extends object> = Extract<keyof T, string> & string;

/**
 * Represents a type that extracts the nested key values of an object type `T`.
 * Nested keys are represented as a string with a dot separator.
 * For example, if `T` has a key `order` with a nested key `id`, `NestedKeyOf<T>` would allow strings like `order.id`.
 */
export type NestedKeyOf<T extends object> = {
  [K in KeyOf<T>]: T[K] extends object
    ? KeyOf<{
        [N in KeyOf<T[K]> as `${K}.${N}`]: never;
      }>
    : never;
}[KeyOf<T>];

/**
 * Represents a type that extracts the array property values of an object type `T`.
 *
 * @typeParam T - The object type from which to extract the array property values.
 * @returns A union type of array property values of `T`.
 */
export type ArrayKeyOf<T extends object> = {
  [K in KeyOf<T>]: T[K] extends Array<unknown> ? K : never;
}[KeyOf<T>];

/**
 * This type alias will allow you to create strings that represent a key of `T` followed by an index in square brackets.
 *
 * For example, if `T` has a key `order` for an array property, `ArrayKeyOfWithIndex<T>` would allow strings like `order[0]`, `order[1]`, etc.
 */
export type IndexedArrayKeyOf<T extends object> = `${ArrayKeyOf<T>}[${number}]`;

/**
 * This type alias will allow you to create strings that represent a key of `T` followed by an index in square brackets.
 *
 * For example, if `T` has a key `order` for an array property, `IndexedNestedArrayKeyOf<T>` would allow strings like `order[0].id`, `order[1].id`, etc.
 */
export type IndexedNestedArrayKeyOf<T extends object> = {
  [K in ArrayKeyOf<T>]: T[K] extends Array<infer I>
    ? I extends object
      ? KeyOf<{
          [N in KeyOf<I> as `${K}[${number}].${N}`]: never;
        }>
      : never
    : never;
}[ArrayKeyOf<T>];

export type EmptyObject = NonNullable<unknown>;
export type Nullish<T> = T | null | undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Callable = (...args: any) => any;
export type IsAsyncCallable<T extends Callable> = ReturnType<T> extends Promise<unknown> ? true : false;

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

export type InferArrayElement<T> = T extends (infer U)[] ? U : never;

export function getLastElement<T>(array: T[], condition: (element: T) => boolean): T | undefined {
  const filteredArray = [...array].filter(condition);
  return filteredArray.pop();
}

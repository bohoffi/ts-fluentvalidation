export type ValueProperty = string | number | boolean | bigint | Date;

export type StringProperty = Extract<ValueProperty, string>;
export type NumberProperty = Extract<ValueProperty, number | bigint>;
export type BooleanProperty = Extract<ValueProperty, boolean>;
export type DateProperty = Extract<ValueProperty, Date>;

export type Property = StringProperty | NumberProperty | BooleanProperty | DateProperty;
export type LengthProperty = StringProperty | ArrayLike<unknown>;

export type ValidationFn<P = unknown> = {
  (value: P | null | undefined): boolean;
  message?: string;
};

export type KeyOf<T extends object> = Extract<keyof T, string> & string;
export type EmptyObject = NonNullable<unknown>;

export type RulesDictionary<T extends object> = Record<string, ValidationFn<T[KeyOf<T>]>[]>;
export type RulesDictionaryInput<T extends object, K extends KeyOf<T>> = { [P in K]: ValidationFn<T[K]>[] };

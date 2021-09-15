export type NonNullableFields<T> = NonNullable<{
	[k in keyof T]: NonNullable<T[k]>;
}>;
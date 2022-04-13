export const hasKeyGuard = <K extends string>(
	value: unknown,
	key: K
): value is { [k in K]: unknown } =>
	value instanceof Object && value.hasOwnProperty(key)

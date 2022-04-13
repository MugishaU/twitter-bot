export const hasKeyGuard = <K extends string, T>(
	value: unknown,
	key: K,
	type?: T
): value is { [k in K]: T } =>
	value instanceof Object && value.hasOwnProperty(key)

export const returnElseDefault = <Type>(
	value: Type | undefined,
	defaultValue: Type
): Type => {
	return value ? value : defaultValue
}

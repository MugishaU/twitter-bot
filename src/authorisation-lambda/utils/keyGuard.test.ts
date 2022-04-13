import { hasKeyGuard } from "./keyGuard"

describe("hasKeyGuard", () => {
	it("should return true if key is found", () => {
		const foo = { bar: "baz" }
		const hasKey = hasKeyGuard(foo, "bar")
		expect(hasKey).toBe(true)
	})

	it("should return false if key is not found", () => {
		const foo = {}
		const hasKey = hasKeyGuard(foo, "bar")
		expect(hasKey).toBe(false)
	})
})

import { gatewayResponse } from "./gatewayResponse"

describe("gatewayResponse", () => {
	it("should return an APIGatewayProxyResult", () => {
		const result = gatewayResponse(200, "foo")
		expect(result).toStrictEqual({ statusCode: 200, body: "foo" })
	})
})

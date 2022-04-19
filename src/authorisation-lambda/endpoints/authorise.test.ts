import { authorise } from "./authorise"
import * as dynamoDB from "../utils/dynamoDB"
import * as ouathURL from "../utils/ouathUrl"

describe("authorise", () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it("should return a redirect response when all 'putItem' calls are succesful", async () => {
		jest.spyOn(dynamoDB, "putItem").mockResolvedValue({ statusCode: 200 })
		jest.spyOn(ouathURL, "generateUrl").mockReturnValue({
			state: "state",
			codeVerifier: "codeVerifier",
			oauthUrl: "foo"
		})

		const result = await authorise()
		expect(result).toStrictEqual({
			statusCode: 303,
			headers: { "Content-Type": "application/json", Location: "foo" },
			body: ""
		})
	})

	it("should return a failure response when any 'putItem' calls fails", async () => {
		jest
			.spyOn(dynamoDB, "putItem")
			.mockResolvedValueOnce({ statusCode: 200 })
			.mockResolvedValueOnce({ statusCode: 500 })
		jest.spyOn(ouathURL, "generateUrl").mockReturnValue({
			state: "state",
			codeVerifier: "codeVerifier",
			oauthUrl: "foo"
		})

		const result = await authorise()
		expect(result).toStrictEqual({
			statusCode: 500,
			headers: { "Content-Type": "application/json" },
			body: ""
		})
	})
})

import * as auth from "./authorisation"
import * as dynamoDB from "../utils/dynamoDB"

describe("getToken", () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetAllMocks()
	})

	it("should return an access token if fetched successfully", async () => {
		jest.spyOn(dynamoDB, "getItem").mockResolvedValueOnce({
			statusCode: 200,
			body: { id: "accessToken", value: "accessTokenValue" }
		})

		const result = await auth.getToken()
		expect(result).toBe("accessTokenValue")
	})

	it("should return an access token if the refresh is successful", async () => {
		jest
			.spyOn(dynamoDB, "getItem")
			.mockResolvedValueOnce({
				statusCode: 500
			})
			.mockResolvedValueOnce({
				statusCode: 200,
				body: { id: "accessToken", value: "accessTokenValue" }
			})

		jest.spyOn(auth, "refreshToken").mockResolvedValue(200)

		const result = await auth.getToken()
		expect(result).toBe("accessTokenValue")
	})

	it("should return an empty string if the refresh is unsuccessful", async () => {
		jest
			.spyOn(dynamoDB, "getItem")
			.mockResolvedValueOnce({
				statusCode: 500
			})
			.mockResolvedValueOnce({
				statusCode: 500
			})

		jest.spyOn(auth, "refreshToken").mockResolvedValue(500)

		const result = await auth.getToken()
		expect(result).toBe("")
	})

	it("should return an empty string if the refresh is successful but second access token fetch fails", async () => {
		jest
			.spyOn(dynamoDB, "getItem")
			.mockResolvedValueOnce({
				statusCode: 500
			})
			.mockResolvedValueOnce({
				statusCode: 500
			})

		jest.spyOn(auth, "refreshToken").mockResolvedValue(200)

		const result = await auth.getToken()
		expect(result).toBe("")
	})
})

//refreshToken
//Refresh is successful
//Refresh is not successful with defined error
//Refresh is not successful with undefined error

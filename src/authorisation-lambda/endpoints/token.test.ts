import axios from "axios"
import * as dynamoDB from "../utils/dynamoDB"
import { token } from "./token"

jest.mock("axios")
const axiosMock = axios as jest.Mocked<typeof axios>

describe("token", () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
	})

	it("should return a success if the Access and Refresh tokens are saved to DynamoDb", async () => {
		jest
			.spyOn(dynamoDB, "getItem")
			.mockResolvedValueOnce({
				statusCode: 200,
				body: { id: "state", value: "state" }
			})
			.mockResolvedValueOnce({
				statusCode: 200,
				body: { id: "codeVerifier", value: "codeVerifier" }
			})

		axiosMock.post.mockResolvedValueOnce({
			status: 200,
			data: { access_token: "accessToken", refresh_token: "refreshToken" }
		})

		jest.spyOn(dynamoDB, "putItem").mockResolvedValue({ statusCode: 200 })

		const result = await token({ state: "state", code: "code" })

		expect(result).toStrictEqual({
			statusCode: 200,
			body: "Access Token and Refresh Token saved to authorisation server."
		})
	})

	it("should fail if the Access or Refresh token fail to save to DynamoDb", async () => {
		jest
			.spyOn(dynamoDB, "getItem")
			.mockResolvedValueOnce({
				statusCode: 200,
				body: { id: "state", value: "state" }
			})
			.mockResolvedValueOnce({
				statusCode: 200,
				body: { id: "codeVerifier", value: "codeVerifier" }
			})

		axiosMock.post.mockResolvedValueOnce({
			status: 200,
			data: { access_token: "accessToken", refresh_token: "refreshToken" }
		})

		jest
			.spyOn(dynamoDB, "putItem")
			.mockResolvedValueOnce({ statusCode: 200 })
			.mockResolvedValueOnce({ statusCode: 500 })

		const result = await token({ state: "state", code: "code" })

		expect(result).toStrictEqual({
			statusCode: 500,
			body: "Error saving Access Token and Refresh Token to authorisation server."
		})
	})

	it("should fail if the Twitter API returns no data", async () => {
		jest
			.spyOn(dynamoDB, "getItem")
			.mockResolvedValueOnce({
				statusCode: 200,
				body: { id: "state", value: "state" }
			})
			.mockResolvedValueOnce({
				statusCode: 200,
				body: { id: "codeVerifier", value: "codeVerifier" }
			})

		axiosMock.post.mockResolvedValueOnce({
			status: 200
		})

		const result = await token({ state: "state", code: "code" })

		expect(result).toStrictEqual({
			statusCode: 500,
			body: "No data received from server."
		})
	})

	it("should fail if the authorization code passed is invalid", async () => {
		jest.spyOn(dynamoDB, "getItem").mockResolvedValue({
			statusCode: 200,
			body: { id: "state", value: "state" }
		})

		axiosMock.post.mockRejectedValue({
			response: {
				status: 400
			},
			message: "Request failed with status 400."
		})

		const result = await token({ state: "state", code: "code" })

		expect(result).toStrictEqual({
			statusCode: 400,
			body: "Request failed with status 400."
		})
	})

	it("should fail if the states don't match", async () => {
		jest.spyOn(dynamoDB, "getItem").mockResolvedValue({
			statusCode: 200,
			body: { id: "state", value: "state" }
		})

		const result = await token({ state: "wrongState", code: "code" })

		expect(result).toStrictEqual({
			statusCode: 400,
			body: "State does not match authorisation server."
		})
	})

	it("should fail if state is not found in DynamoDb", async () => {
		jest.spyOn(dynamoDB, "getItem").mockResolvedValueOnce({
			statusCode: 404
		})

		const result = await token({ state: "state", code: "code" })

		expect(result).toStrictEqual({
			statusCode: 404,
			body: "State not found on authorisation server."
		})
	})

	it("should fail if code verifier is not found in DynamoDb", async () => {
		jest
			.spyOn(dynamoDB, "getItem")
			.mockResolvedValueOnce({
				statusCode: 200,
				body: { id: "state", value: "state" }
			})
			.mockResolvedValueOnce({
				statusCode: 404
			})

		const result = await token({ state: "state", code: "code" })

		expect(result).toStrictEqual({
			statusCode: 404,
			body: "Code Verifier not found on authorisation server."
		})
	})

	it("should fail if the state or code isn't present in the callback query parameters", async () => {
		const resultNoState = await token({ code: "code" })
		const resultNoCode = await token({ state: "state" })

		expect(resultNoCode).toStrictEqual({
			statusCode: 404,
			body: "State and/or code not provided."
		})

		expect(resultNoState).toStrictEqual({
			statusCode: 404,
			body: "State and/or code not provided."
		})
	})

	it("should fail if the call to the Twitter API fails", async () => {
		jest
			.spyOn(dynamoDB, "getItem")
			.mockResolvedValueOnce({
				statusCode: 200,
				body: { id: "state", value: "state" }
			})
			.mockResolvedValueOnce({
				statusCode: 200,
				body: { id: "codeVerifier", value: "codeVerifier" }
			})

		axiosMock.post.mockRejectedValue({
			response: { status: 500 },
			message: "Generic Axios Error Message"
		})

		jest.spyOn(dynamoDB, "putItem").mockResolvedValue({ statusCode: 200 })

		const result = await token({ state: "state", code: "code" })

		expect(result).toStrictEqual({
			statusCode: 500,
			body: "Generic Axios Error Message"
		})
	})
})

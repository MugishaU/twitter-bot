import axios from "axios"
import * as dynamoDB from "../utils/dynamoDB"
import { token } from "./token"

//Code not found on DB
//State and/or Code Not Provided query params
//Axios error

jest.mock("axios")
const axiosMock = axios as jest.Mocked<typeof axios>

describe("token", () => {
	beforeEach(() => {
		jest.clearAllMocks()
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
			status: 404
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
		jest
			.spyOn(dynamoDB, "getItem")
			.mockResolvedValueOnce({
				statusCode: 404
			})
			.mockResolvedValueOnce({
				statusCode: 200,
				body: { id: "codeVerifier", value: "codeVerifier" }
			})

		const result = await token({ state: "state", code: "code" })

		expect(result).toStrictEqual({
			statusCode: 404,
			body: "State not found on authorisation server."
		})
	})
})

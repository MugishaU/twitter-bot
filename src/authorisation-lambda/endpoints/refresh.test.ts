import axios from "axios"
import * as dynamoDB from "../utils/dynamoDB"
import { refresh } from "./refresh"

jest.mock("axios")
const axiosMock = axios as jest.Mocked<typeof axios>

describe("refresh", () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
	})

	it("should return a sucess if the new Access and Refresh tokens are saved to DynamoDb", async () => {
		jest.spyOn(dynamoDB, "getItem").mockResolvedValue({
			statusCode: 200,
			body: { id: "refreshToken", value: "refreshToken" }
		})

		axiosMock.post.mockResolvedValueOnce({
			status: 200,
			data: { access_token: "newAccessToken", refresh_token: "newRefreshToken" }
		})

		jest.spyOn(dynamoDB, "putItem").mockResolvedValue({ statusCode: 200 })

		const result = await refresh()

		expect(result).toStrictEqual({
			statusCode: 200,
			body: "Access Token and Refresh Token saved to authorisation server."
		})
	})

	it("should fail if the Refresh Token is not found in DynamoDb", async () => {
		jest.spyOn(dynamoDB, "getItem").mockResolvedValue({
			statusCode: 404
		})

		const result = await refresh()

		expect(result).toStrictEqual({
			statusCode: 404,
			body: "Refresh Token not found on authorisation server."
		})
	})

	it("should fail if the call to the Twitter API fails", async () => {
		jest.spyOn(dynamoDB, "getItem").mockResolvedValue({
			statusCode: 200,
			body: { id: "refreshToken", value: "refreshToken" }
		})

		axiosMock.post.mockRejectedValue({
			response: { status: 500 },
			message: "Generic Axios Error Message"
		})

		const result = await refresh()

		expect(result).toStrictEqual({
			statusCode: 500,
			body: "Generic Axios Error Message"
		})
	})

	it("should fail if the Twitter API returns no data", async () => {
		jest.spyOn(dynamoDB, "getItem").mockResolvedValue({
			statusCode: 200,
			body: { id: "refreshToken", value: "refreshToken" }
		})

		axiosMock.post.mockResolvedValueOnce({
			status: 200
		})

		jest.spyOn(dynamoDB, "putItem").mockResolvedValue({ statusCode: 200 })

		const result = await refresh()

		expect(result).toStrictEqual({
			statusCode: 500,
			body: "No data received from server."
		})
	})

	it("should fail if the new Access or Refresh token fail to save to DynamoDb", async () => {
		jest.spyOn(dynamoDB, "getItem").mockResolvedValue({
			statusCode: 200,
			body: { id: "refreshToken", value: "refreshToken" }
		})

		axiosMock.post.mockResolvedValueOnce({
			status: 200,
			data: { access_token: "accessToken", refresh_token: "refreshToken" }
		})

		jest
			.spyOn(dynamoDB, "putItem")
			.mockResolvedValueOnce({ statusCode: 200 })
			.mockResolvedValueOnce({ statusCode: 500 })

		const result = await refresh()

		expect(result).toStrictEqual({
			statusCode: 500,
			body: "Error saving Access Token and Refresh Token to authorisation server."
		})
	})
})

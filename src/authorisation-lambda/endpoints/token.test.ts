import axios from "axios"
import * as dynamoDB from "../utils/dynamoDB"
import { token } from "./token"

//State Matches & Code Correct but fails to save
//State Matches & Code correct but no data returned from server
//State Matches & Code Incorrect
//State Doesn't Match
//State not found on DB
//Code not found on DB
//State and/or Code Not Provided query params

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

		jest.spyOn(dynamoDB, "putItem").mockResolvedValue({ statusCode: 200 })

		axiosMock.post.mockResolvedValueOnce({
			status: 200,
			data: { access_token: "accessToken", refresh_token: "refreshToken" }
		})

		const result = await token({ state: "state", code: "code" })

		expect(result).toStrictEqual({
			statusCode: 200,
			body: "Access Token and Refresh Token saved to authorisation server."
		})
	})
})

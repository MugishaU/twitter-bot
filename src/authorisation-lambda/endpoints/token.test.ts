import { token } from "./token"
import axios from "axios"
import * as dynamoDB from "../utils/dynamoDB"

//State Matches & Code Correct
//State Matches & Code Correct but fails to save
//State Matches & Code Incorrect
//State Doesn't Match
//State not found on DB
//Code not found on DB
//State and/or Code Not Provided query params

jest.mock("axios")
const axiosMock = axios as jest.Mocked<typeof axios>

describe("token", () => {
	beforeAll(() => {
		process.env = Object.assign(process.env, {
			CLIENT_SECRET: "client-secret"
		})
	})

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

		//how do you mock a call of axios(options)??
		axiosMock.request.mockResolvedValue({
			status: 200,
			data: { access_token: "accessToken", refresh_token: "refreshToken" }
		})

		const result = await token({ state: "state", code: "code" })

		expect(result).toStrictEqual({ stausCode: 200 })
	})
})

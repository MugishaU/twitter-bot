import * as auth from "./authorisation"
import * as dynamoDB from "../utils/dynamoDB"
import axios from "axios"

jest.mock("axios")
const axiosMock = axios as jest.Mocked<typeof axios>

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

describe("refreshToken", () => {
	beforeAll(() => {
		jest.restoreAllMocks()
	})

	beforeEach(() => {
		jest.clearAllMocks()
		jest.resetAllMocks()
	})

	it("should return 200 if successful", async () => {
		axiosMock.create.mockReturnThis()
		axiosMock.get.mockResolvedValue({
			status: 200
		})

		const result = await auth.refreshToken()
		expect(result).toBe(200)
	})

	it("should fail with defined error if available", async () => {
		axiosMock.create.mockReturnThis()
		axiosMock.get.mockRejectedValue({
			response: { status: 403 }
		})

		const result = await auth.refreshToken()
		expect(result).toBe(403)
	})

	it("should fail with generic error if no defined error is available", async () => {
		axiosMock.create.mockReturnThis()
		axiosMock.get.mockRejectedValue({})

		const result = await auth.refreshToken()
		expect(result).toBe(500)
	})
})

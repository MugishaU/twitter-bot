import axios from "axios"
import { search, retweet } from "./twitter"

jest.mock("axios")
const axiosMock = axios as jest.Mocked<typeof axios>

describe("fetchTweets", () => {
	beforeEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
	})

	it("should successfully return tweets", async () => {
		axiosMock.get.mockResolvedValue({
			status: 200,
			data: { data: [{ id: "0", text: "foo" }] }
		})

		const result = await search("bar", "test-bearer-token")

		expect(axiosMock.get).toHaveBeenCalledWith(
			"https://api.twitter.com/2/tweets/search/recent?max_results=50&query=bar",
			{ headers: { Authorization: "BEARER test-bearer-token" } }
		)
		expect(result).toStrictEqual({
			statusCode: 200,
			message: "Tweets fetched successfully",
			tweets: [{ id: "0", text: "foo" }]
		})
	})

	it("should successfully return when no tweets are found", async () => {
		axiosMock.get.mockResolvedValue({
			status: 200,
			data: {}
		})

		const result = await search("bar", "test-bearer-token")

		expect(axiosMock.get).toHaveBeenCalledWith(
			"https://api.twitter.com/2/tweets/search/recent?max_results=50&query=bar",
			{ headers: { Authorization: "BEARER test-bearer-token" } }
		)
		expect(result).toStrictEqual({
			statusCode: 200,
			message: "No tweets matching search term 'bar'"
		})
	})

	it("should return a defined error correctly", async () => {
		axiosMock.get.mockRejectedValue({
			response: { status: 404 },
			message: "Request failed with status code 404"
		})

		const result = await search("bar", "test-bearer-token")

		expect(axiosMock.get).toHaveBeenCalledWith(
			"https://api.twitter.com/2/tweets/search/recent?max_results=50&query=bar",
			{ headers: { Authorization: "BEARER test-bearer-token" } }
		)
		expect(result).toStrictEqual({
			statusCode: 404,
			message: "Request failed with status code 404"
		})
	})

	it("should return an undefined error correctly", async () => {
		axiosMock.get.mockRejectedValue({})

		const result = await search("bar", "test-bearer-token")

		expect(axiosMock.get).toHaveBeenCalledWith(
			"https://api.twitter.com/2/tweets/search/recent?max_results=50&query=bar",
			{ headers: { Authorization: "BEARER test-bearer-token" } }
		)
		expect(result).toStrictEqual({
			statusCode: 500,
			message: "Failed to fetch tweets"
		})
	})
})

// Pass
// Fail
describe("retweet", () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it("should return 200 when successful", async () => {
		axiosMock.post.mockResolvedValue({
			status: 200,
			data: {
				data: {
					retweeted: true
				}
			}
		})
		const result = await retweet("0", "test-bearer-token")
		expect(result).toBe(200)
	})

	it("should return a defined error code if available when unsuccessful", async () => {
		axiosMock.post.mockRejectedValue({
			response: {
				status: 403
			},
			message: "Request failed with status code 403"
		})
		const result = await retweet("0", "test-bearer-token")
		expect(result).toBe(403)
	})

	it("should return a generic error code if available when unsuccessful", async () => {
		axiosMock.post.mockRejectedValue({
			response: {},
			message: "Request failed with status code 403"
		})
		const result = await retweet("0", "test-bearer-token")
		expect(result).toBe(500)
	})
})

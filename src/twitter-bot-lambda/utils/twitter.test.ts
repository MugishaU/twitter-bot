import axios from "axios"
import { fetchTweets, retweet } from "./twitter"

jest.mock("axios")
const axiosMock = axios as jest.Mocked<typeof axios>

describe("fetchTweets", () => {
	beforeAll(() => {
		process.env = Object.assign(process.env, {
			TWITTER_BEARER_TOKEN: "test-bearer-token"
		})
	})

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it("should successfully return tweets", async () => {
		axiosMock.get.mockResolvedValue({
			status: 200,
			data: { data: [{ id: "0", text: "foo" }] }
		})

		const result = await fetchTweets("bar")

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

		const result = await fetchTweets("bar")

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

		const result = await fetchTweets("bar")

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

		const result = await fetchTweets("bar")

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

describe("retweet", () => {
	beforeAll(() => {
		process.env = Object.assign(process.env, {
			TWITTER_BEARER_TOKEN: "test-bearer-token"
		})
	})

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it("should just pass for now", () => {
		const result = retweet("0")
		expect(true).toBe(true)
	})
})

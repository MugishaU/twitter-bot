import { mockClient } from "aws-sdk-client-mock"
import axios from "axios"
import { fetchTweets } from "./twitter"

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
			data: { data: [{ id: "0", text: "foo" }], meta: {} }
		})

		const result = await fetchTweets("bar")

		expect(axiosMock.get).toHaveBeenCalledWith(
			"https://api.twitter.com/2/tweets/search/recent?query=bar",
			{ headers: { Authorization: "BEARER test-bearer-token" } }
		)
		expect(result).toStrictEqual({
			statusCode: 200,
			message: "Tweets fetched successfully.",
			tweets: [{ id: "0", text: "foo" }]
		})
	})

	it("should successfully return paginated results", async () => {
		axiosMock.get
			.mockResolvedValueOnce({
				data: { data: [{ id: "0", text: "foo" }], meta: { next_token: "0" } }
			})
			.mockResolvedValueOnce({
				data: { data: [{ id: "1", text: "bar" }], meta: {} }
			})

		const result = await fetchTweets("bar")

		expect(axiosMock.get).toHaveBeenNthCalledWith(
			1,
			"https://api.twitter.com/2/tweets/search/recent?query=bar",
			{ headers: { Authorization: "BEARER test-bearer-token" } }
		)
		expect(axiosMock.get).toHaveBeenNthCalledWith(
			2,
			"https://api.twitter.com/2/tweets/search/recent?query=bar&next_token=0",
			{ headers: { Authorization: "BEARER test-bearer-token" } }
		)
	})
})

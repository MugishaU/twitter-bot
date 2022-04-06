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

	beforeEach(() => {})

	it("should successfully return tweets", async () => {
		axiosMock.get.mockResolvedValue({
			data: { data: [{ id: "0", text: "foo" }], meta: {} }
		})

		const results = await fetchTweets("bar")
		expect(axiosMock.get).toHaveBeenCalledWith(
			"https://api.twitter.com/2/tweets/search/recent?query=bar",
			{ headers: { Authorization: "BEARER test-bearer-token" } }
		)
		expect(results).toStrictEqual({
			statusCode: 200,
			message: "Tweets fetched successfully.",
			tweets: [{ id: "0", text: "foo" }]
		})
	})
})

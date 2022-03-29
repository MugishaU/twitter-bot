import "dotenv/config"
import axios, { AxiosResponse } from "axios"

interface Tweet {
	id: string
	text: string
}

interface TweetFetchResponse {
	statusCode: number
	message: string
	tweets?: Tweet[]
}

export const fetchTweets = async (
	searchTerm: string,
	tweets: Tweet[] = [],
	nextToken?: string,
	index: number = 0
): Promise<TweetFetchResponse> => {
	const bearerToken: string = process.env.TWITTER_BEARER_TOKEN || "Not Found"

	const searchUrl = `https://api.twitter.com/2/tweets/search/recent?query=${searchTerm}`
	const nextTokenQuery = nextToken ? `&next_token=${nextToken}` : ""
	const urlWithNextToken = searchUrl + nextTokenQuery
	const options = {
		headers: {
			Authorization: `BEARER ${bearerToken}`,
		},
	}

	let response: TweetFetchResponse = {
		statusCode: 500,
		message: "fetchTweets failed to run.",
	}

	try {
		const axiosResponse: AxiosResponse = await axios.get(
			urlWithNextToken,
			options
		)
		const currentResults = tweets

		if (axiosResponse.data.data) {
			currentResults.push(axiosResponse.data.data)
		}

		if (axiosResponse.data.meta.next_token && index < 4) {
			fetchTweets(
				searchTerm,
				currentResults,
				axiosResponse.data.meta.next_token,
				(index += 1)
			)
		} else {
			response = {
				statusCode: 200,
				message: "Tweets fetched successfully.",
				tweets: tweets.flat(),
			}
		}
	} catch (error) {
		response = {
			statusCode: error.code || error.response.status || 500,
			message: error.message || "Undefined Error",
		}
		console.log(response)
	} finally {
		return response
	}
}

export const retweet = (id: string): void => {
	console.log(id)
}

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
	searchTerm: string
): Promise<TweetFetchResponse> => {
	const bearerToken: string | undefined = process.env.TWITTER_BEARER_TOKEN

	const url = `https://api.twitter.com/2/tweets/search/recent?max_results=50&query=${searchTerm}`

	const options = {
		headers: {
			Authorization: `BEARER ${bearerToken}`
		}
	}

	let response: TweetFetchResponse = {
		statusCode: 500,
		message: "Failed to fetch Tweets."
	}

	try {
		const axiosResponse: AxiosResponse = await axios.get(url, options)

		if (axiosResponse.data.data) {
			response = {
				statusCode: axiosResponse.status,
				message: "Tweets fetched successfully.",
				tweets: axiosResponse.data.data
			}
		} else {
			response = {
				statusCode: axiosResponse.status,
				message: `No tweets matching search term '${searchTerm}'`
			}
		}
	} catch (error) {
		response = {
			statusCode: error.response.status || 500,
			message: error.message || "Undefined Error"
		}
		console.log(response)
	} finally {
		return response
	}
}

export const retweet = (id: string): void => {
	console.log(id)
}

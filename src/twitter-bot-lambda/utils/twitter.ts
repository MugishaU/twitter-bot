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
	bearerToken: string
): Promise<TweetFetchResponse> => {
	const url = `https://api.twitter.com/2/tweets/search/recent?max_results=50&query=${searchTerm}`

	const options = {
		headers: {
			Authorization: `BEARER ${bearerToken}`
		}
	}

	let response: TweetFetchResponse = {
		statusCode: 500,
		message: "Failed to fetch tweets"
	}

	try {
		const axiosResponse = await axios.get(url, options)

		if (axiosResponse.data.data) {
			response = {
				statusCode: axiosResponse.status,
				message: "Tweets fetched successfully",
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
	} finally {
		return response
	}
}

export const retweet = async (
	id: string,
	bearerToken: string
): Promise<number> => {
	const userId = "1485092360526704647"
	const url = `https://api.twitter.com/2/users/${userId}/retweets`
	const body = {
		tweet_id : id
	}
	const options = {
		headers : {
			Authorization: `BEARER ${bearerToken}`
		}
	}

	try {
		const axiosResponse = await axios.post(url, body, options)
		return axiosResponse.status
	} catch (error) {
		console.error(error.message)
		return error.response.status || 500
	}

}

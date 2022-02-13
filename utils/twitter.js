require("dotenv").config()
const axios = require("axios").default

const fetch = async (searchTerm, nextToken = null, tweets = [], index = 1) => {
	const bearerToken = process.env.TWITTER_BEARER_TOKEN
	const searchUrl = `https://api.twitter.com/2/tweets/search/recent?query=${searchTerm}`
	const nextTokenQuery = nextToken ? `&next_token=${nextToken}` : ""
	const urlWithNextToken = searchUrl + nextTokenQuery
	const options = {
		headers: {
			Authorization: `BEARER ${bearerToken}`,
		},
	}

	try {
		const response = await axios.get(urlWithNextToken, options)
		const currentResults = tweets
		// count is to protect the API, a maximum of 50 tweets are collected.
		const count = index + 1

		if (response.data.data) {
			currentResults.push(response.data.data)
		}

		if (response.data.meta.next_token && index < 5) {
			fetch(searchTerm, response.data.meta.next_token, currentResults, count)
		} else {
			console.log(tweets.flat())
		}
	} catch (error) {
		console.log({
			errorCode: error.code ? error.code : error.response.status,
			errorMessage: error.message,
		})
	}
}

exports.fetch = fetch

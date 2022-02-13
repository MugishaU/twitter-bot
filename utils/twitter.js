require("dotenv").config()
const axios = require("axios").default

const fetch = (searchTerm, nextToken = null, tweets = [], index = 1) => {
	const bearerToken = process.env.TWITTER_BEARER_TOKEN
	const searchUrl = `https://api.twitter.com/2/tweets/search/recent?query=${searchTerm}`
	const nextTokenQuery = nextToken ? `&next_token=${nextToken}` : ""
	const urlWithNextToken = searchUrl + nextTokenQuery
	const options = {
		headers: {
			Authorization: `BEARER ${bearerToken}`,
		},
	}

	axios
		.get(urlWithNextToken, options)
		.then((response) => {
			const apiResults = tweets

			if (response.data.data) {
				apiResults.push(response.data.data)
			}

			//count is to protect the API, a maximum of 50 tweets are collected.
			const count = index + 1

			if (response.data.meta.next_token && index < 5) {
				fetch(searchTerm, response.data.meta.next_token, apiResults, count)
			} else {
				console.log(tweets.flat())
			}
		})
		.catch((error) => {
			console.log(error)
		})
}

exports.fetch = fetch

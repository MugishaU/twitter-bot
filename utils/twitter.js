require("dotenv").config()
const axios = require("axios").default

const fetch = (searchTerm, next_token = null, tweets = [], index = 1) => {
	const bearerToken = process.env.TWITTER_BEARER_TOKEN
	const URL = `https://api.twitter.com/2/tweets/search/recent?query=${searchTerm}`
	const nextTokenQuery = next_token ? `&next_token=${next_token}` : ""
	const fullURL = URL + nextTokenQuery
	const options = {
		headers: {
			Authorization: `BEARER ${bearerToken}`,
		},
	}

	axios
		.get(fullURL, options)
		.then((response) => {
			const apiResults = tweets

			//count is to protect the API, a maximum of 50 tweets are collected.
			const count = index + 1

			apiResults.push(response.data.data)

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

require("dotenv").config()
const axios = require("axios").default

const fetch = (searchTerm, next_token = null, results = []) => {
	const bearerToken = process.env.TWITTER_BEARER_TOKEN
	const URL = `https://api.twitter.com/2/tweets/search/recent?query=${searchTerm}`
	const nextTokenQuery = next_token ? `&next_token=${next_token}` : ""
	const fullURL = URL + nextTokenQuery
	const options = {
		headers: {
			Authorization: `BEARER ${bearerToken}`,
		},
	}

	const response = axios
		.get(fullURL, options)
		.then((response) => {
			console.log(response.data)
		})
		.catch((error) => console.log(error))

	return response
}

exports.fetch = fetch

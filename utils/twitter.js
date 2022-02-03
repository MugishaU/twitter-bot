require("dotenv").config()
const axios = require("axios").default

const fetch = (searchTerm) => {
	const bearerToken = process.env.TWITTER_BEARER_TOKEN
	const url = `https://api.twitter.com/2/tweets/search/recent?query=${searchTerm}`
	const options = {
		headers: {
			Authorization: `BEARER ${bearerToken}`,
		},
	}

	const response = axios
		.get(url, options)
		.then((response) => {
			console.log(response.data)
		})
		.catch((error) => console.log(error))

	return response
}

exports.fetch = fetch

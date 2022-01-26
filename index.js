require("dotenv").config()
const axios = require("axios").default

const queryString = "%23BlackInTech%20apply%20now"

const fetchTweet = (searchTerm) => {
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

fetchTweet(queryString)

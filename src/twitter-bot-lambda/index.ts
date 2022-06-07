import { fetchTweets, retweet } from "./utils/twitter"
import { getToken } from "./functions/authorisation"
import { putItem } from "./utils/dynamoDB"

// const queries = [
// 	"%23BlackInTech apply now -is:retweet",
// 	"%23BlackTechTwitter apply now -is:retweet",
// 	"%23BlackWomenInTech apply now -is:retweet"
// ]

// for (let query of queries) {
// 	fetchTweets(query).then((x) => console.log(x))
// }

interface CloudWatchEvent {
	query: string
}

export const handler = async (event: CloudWatchEvent): Promise<void> => {
	console.log(`Lambda Invoked. Payload: ${event.query}`)
	const bearerToken = await getToken()

	const searchResult = await fetchTweets(event.query, bearerToken)

	if (searchResult.tweets) {
		for (const tweet of searchResult.tweets) {
			const saveTweet = await putItem("twitter-history", {
				id: tweet.id,
				value: tweet.text
			})
			console.log(saveTweet.statusCode)
		}
	}
}

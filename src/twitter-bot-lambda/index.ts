import { fetchTweets, retweet } from "./utils/twitter"
import { getToken } from "./functions/authorisation"
import { getItem, putItem, checkDynamoDbResult } from "./utils/dynamoDB"

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
			const dynamoDBItem = await getItem("twitter-history", { id: tweet.id })
			const historicTweet = checkDynamoDbResult(dynamoDBItem)

			if (!historicTweet) {
				const retweetResult = await retweet(tweet.id, bearerToken)
				if (retweetResult == 200) {
					await putItem("twitter-history", {
						id: tweet.id,
						value: tweet.text
					})
				} else {
					console.error(`Retweeting tweet with id: ${tweet.id} failed`)
				}
			} else {
				console.log(`Tweet with id: ${tweet.id} has already been retweeted`)
			}
		}
	}
}
